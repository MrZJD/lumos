function getBody(ctx) {
    return new Promise((resolve, reject) => {
        let type = ctx.headers['content-type'];
        let result = '';
        ctx.req.on('data', (chunk) => {
            result += chunk;
        });
        ctx.req.on('end', () => {
            if (type === 'application/json') {
                ctx.request.body = JSON.parse(result);
            } else {
                ctx.request.body = result;
            }
            resolve();
        });
    });
}


function handleMsg (data) {
    // -> 第一个字节用于描述消息是否结束
    // -> 最高位为1则消息为尾部，0则后续还有数据包
    // -> 后3位用于数据扩展，sec-websocket-extendsion，没有约定必须为0
    // -> 最低4位描述消息类型
    var isFinished = (data[0] >> 7) > 0;
    var type = data[0] & 0xF;

    if (type === 8) {
        // 链接断开消息
        return false;
    }

    // -> 第二个字节用于描述掩码和消息长度
    // -> 最高位用0或1来描述是否有掩码处理
    // -> 剩下的后面7位用来描述消息长度
    // -> -> 1一种是消息内容少于126存储消息长度
    // -> -> 2如果消息长度少于UINT16的情况此值为126 -> 2bytes
    // -> -> 3当消息长度大于UINT16的情况下此值为127 -> 4bytes

    var hasMask = (data[1] >>7) > 0;
    var pkgLength = data[1] & 0x7f;
    var start = 2;

    if (pkgLength === 126) {
        pkgLength = Buffer.from(data.slice(2, 4)).readUInt16BE();
        start += 2;
    } else if (pkgLength === 127) {
        pkgLength = Buffer.from(data.slice(2, 6)).readUInt32BE();
        start += 4;
    }

    // 如果有掩码
    var maskCode;
    if (hasMask) {
        maskCode = Buffer.from(data.slice(start, start+4));
        start += 4;
    }

    // console.log('hasMask -> ', hasMask);
    // console.log('maskCode -> ', maskCode);
    // console.log('pkglen ->', pkgLength);

    // 如果有掩码解码
    // 掩码循环解码
    var result = Buffer.from(data.slice(start));

    if (!!maskCode) {
        for(var i=0, len=result.length;i < len; i++) {
            result[i] = result[i] ^ maskCode[i%4];
        }
    }

    return result;
}

function generateMsg (databuf) {
    // 生成数据发送给服务器端
    var msgArr = new Uint8Array();

    // -> 1.服务器发送的数据以0x81开头
    var w_1 = Buffer.from([0x81]);

    // -> 2.紧接发送内容的长度
    // -> 2.1. 若长度在0-125，则1个byte表示长度
    // -> 2.2. 若长度不超过0xFFFF，则后2个byte 作为无符号16位整数表示长度
    // -> 2.3. 若超过0xFFFF，则后8个byte作为无符号64位整数表示长度
    var w_2;
    var len = databuf.length;
    if (len < 126) {
        w_2 = Buffer.from([len]);
    } else if (len <= 0xFFFF) {
        w_2 = Buffer.alloc(3);
        w_2[0] = 126;
        w_2.writeUInt16BE(len, 1);
    } else {
        // 超长处理
        w_2 = Buffer.from([
            127, 0, 0, 0, 0,
            len >> 24, // 取len最高位字节
            len >> 16, // 取len第2字节
            len >> 8, // 取len第3字节
            len & 0xFF, // 取len最后一个字节
        ]);
    }

    // -> 添加数据量
    return Buffer.concat([w_1, w_2, databuf]);
}

module.exports = {
    getBody, handleMsg, generateMsg
};
