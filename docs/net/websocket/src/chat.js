const { handleMsg, generateMsg } = require('./util/util');
const crypto = require('crypto');
const url = require('url');

class ChatManager {
    constructor (server) {
        this._server = server;
        // 聊天室
        this.chatpool = {
            '00001': {
                _socket: {},
                members: [
                    '15801',
                    '15802',
                ]
            }
        };
        this.chatmsgCachePool = {}; //记录用户不在线时的信息

        this._init();
        this._op = {
            'enter': this._enter,
            'msg': this._msg
        };
    }

    _init () {
        this._server.on('upgrade', (req, socket, head) => {
			var pathname = url.parse(req.url).pathname;
			
			if (pathname !== '/chat') {
				socket.end();
				return ;
			}
			
            const version = +req.headers['sec-websocket-version']; // -> ws version
        
            if (req.method !== 'GET' || req.headers.upgrade.toLowerCase() !== 'websocket' || !req.headers['sec-websocket-key'] || (version !== 8 && version !== 13)) {
                // -> 如果upgrade信息错误则返回
                socket.end('HTTP/1.1 400 Bad Request');
                return ;
            }
        
            // upgrade
            const key = crypto.createHash('sha1')
                .update(req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
                .digest('base64');
            
            const headers = [
                'HTTP/1.1 101 Switching Protocols',
                'Upgrade: websocket',
                'Connection: Upgrade',
                `Sec-WebSocket-Accept: ${key}`,
            ]
        
            var protocol = (req.headers['sec-websocket-protocol'] || '').split(/, */);
            if (protocol[0]) {
                headers.push(`Sec-WebSocket-Protocol: ${protocol[0]}`);
            }
        
            // if (req.headers['sec-websocket-extensions']) {
            //     headers.push(`Sec-WebSocket-Extensions: ${req.headers['sec-websocket-extensions']}`);
            // }
            
			socket.setKeepAlive(true);
            socket.write(headers.concat('', '').join('\r\n'));
        
            // 创建完成
            this._onChat(socket);
        });
    }

    _onChat (socket) {
        socket.on('data', (data) => {
            data = handleMsg(data);
            if (!data) {
                // 数据请求断开
                socket.end();
                return ;
            }

            var event = JSON.parse(data.toString());
            this._op[event.cmd].bind(this)(socket, event.data);
        });

        socket.on('error', (err) => {
            console.log('socket err:\r\n', err);
        });

        socket.on('end', () => {
			socket.destroy();
        });

        socket.on('close', () => {
			socket.destroy();
        });
    }

    send(socket, data) {
        socket.write(this._getMsgS(data));
    }

    _enter(socket, data) {
        const room = this.chatpool[data.rid]
        if (!room) {
            this.send(socket, { cmd: 'sys', msg: '聊天室不存在' });
            return
        }

        if (room.members.indexOf(data.uid) === -1) {
            this.send(socket, { cmd: 'sys', msg: '您不是改聊天室的成员' });
            return
        }

        if (room._socket[data.uid]) {
            room._socket[data.uid].end();
            room._socket[data.uid] = null;
        }

        room._socket[data.uid] = socket;
        socket._id_ = data.rid;
        socket._uid_ = data.uid;

        // -> 推送不在线时的缓存消息
        var cachadata = this.chatmsgCachePool[data.rid] && this.chatmsgCachePool[data.rid][data.uid];
        if (!cachadata) {
            return ;
        }
        while (cachadata.length !== 0) {
            this.send(socket, cachadata.pop());
        }
    }

    _msg(socket, data) {
        const rid = socket._id_;
        const senderId = socket._uid_;
        const room = this.chatpool[rid];
        if (!room) {
            this.send(socket, { cmd: 'sys', msg: '聊天室不存在' });
            return
        }

        const resp = {
            fromId: senderId,
            msg: data
        }

        room.members.forEach(uid => {
            if (!room._socket[uid]) {
                const cachePool = this.chatmsgCachePool

                if (!cachePool[rid]) {
                    cachePool[rid] = {}
                    cachePool[rid][uid] = [resp]
                    return
                }

                if (!cachePool[rid][uid]) {
                    cachePool[rid][uid] = [resp]
                    return
                }

                cachePool[rid][uid].push(resp)
                return
            }
            this.send(room._socket[uid], resp)
        })
    }

    _getMsgS(data) {
        let msg;
        if (typeof data === 'string') {
            msg = Buffer.from(data);
        } else {
            msg = Buffer.from(JSON.stringify(data));
        }
        return generateMsg(msg);
    }

}

module.exports = ChatManager;