const { Server } = require('socket.io');
let io;

const db = require('./mysql');

module.exports = async (server) => {

    io = new Server(server, {
        cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] }
    });

    io.on('connection', async (socket) => {

        const roomId = socket.handshake.query.roomId;
        let setId = socket.handshake.query.socketId;

        if (roomId) {
            socket.join(roomId);

            socket.emit('id', socket.id);

            const get = (await db.execute('SELECT host, second_player FROM room WHERE id = ?', [roomId]))[0][0];
            if ((!get.host || get.host === 'null') && get.second_player !== setId && setId) {
                const insert = (await db.query('UPDATE room SET host = ? WHERE id = ?', [setId, roomId]))[0];
                io.emit('refresh board');
            } else if ((!get.second_player || get.second_player === 'null') && get.host !== setId && setId) {
                const insert = (await db.query('UPDATE room SET second_player = ? WHERE id = ?', [setId, roomId]))[0];
                io.emit('refresh board');
            }

            socket.emit('message received');
        }

        socket.on('message sent', () => {
            io.in(roomId).emit('message received');
        });

        socket.on('move submitted', () => {
            io.in(roomId).emit('refresh board');
        });

        socket.on('started typing', async () => {
            const name = (await db.query('Select name from player where socket_id = ?', [setId]))[0][0];
            socket.to(roomId).emit('started typing', name.name);
        });

        socket.on('stopped typing', async () => {
            const name = (await db.query('Select name from player where socket_id = ?', [setId]))[0][0];
            socket.to(roomId).emit('stopped typing', name.name);
        });

        socket.on('disconnect', async () => {
            const update = (await db.query(`UPDATE room set host = null where host = '${setId}'`));
            const secondUpdate = (await db.query(`UPDATE room set second_player = null where second_player = '${setId}'`));
        });


    });

}