const http = require('http');
const ChatManager = require('./src/chat');

const server = http.createServer();

new ChatManager(server);

server.listen(9001, () => {
    console.log('server is listening at: 9001');
});

// just a little boring
