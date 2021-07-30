var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const db = require('./mysql');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/board/:id', (req, res) => {
    res.json({ hello: 'hello' });
});

app.post('/board/:roomId', async (req, res) => {
    let board = req.body.board;
    let socketId = req.body.socketId;
    let roomId = req.params.roomId;

    if (!board || !roomId) {
        res.status(400).end();
    }

    board = JSON.stringify(board);

    await db.query('update room set board = ?, last_player = ? where id = ?', [board, socketId, roomId]);

    res.json({});
});

app.get('/rooms', async (req, res) => {
    res.json((await db.query('select room.*, player.name as host_name from room left join player on player.socket_id = room.host'))[0]);
});

app.post('/rooms', async (req, res) => {
    if (req.body) {
        const insert = (await db.query('INSERT INTO room SET ?', req.body))[0];

        if (insert) {
            res.json({ id: insert.insertId });
        } else {
            res.status(400).end();
        }
    } else {
        res.status(400).end();
    }
});

app.get('/rooms/:id/chat', async (req, res) => {
    const roomId = req.params.id;

    if (roomId) {
        const messages = (await db.execute('SELECT * FROM chat JOIN player ON player.socket_id = chat.user WHERE room_id = ? ORDER BY chat.id ASC', [roomId]))[0];
        if (messages) {
            messages.forEach(message => {
                if (message.system_user) {
                    message.message = message.message.replace('{PLAYER}', message.name);
                }
            });

            res.json(messages);
        } else {
            res.status(400).end();
        }
    } else {
        res.status(400).end();
    }
});

app.get('/player/:id', async (req, res) => {
    if (req.params.id) {
        const get = (await db.execute('SELECT * FROM player WHERE socket_id = ?', [req.params.id]))[0][0];
        res.json(get);
    } else {
        res.status(400).end();
    }
});

app.post('/player', async (req, res) => {
    if (req.body) {
        const insert = (await db.query('INSERT INTO player SET ?', req.body))[0];
        res.json({});
    } else {
        res.status(400).end();
    }
});

app.post('/rooms/:roomId/player/:playerId', async (req, res) => {
    if (!req.params.roomId || !req.params.playerId || !req.body) {
        res.status(400).end();
    }

    const obj = {
        room_id: req.params.roomId,
        message: req.body.message,
        user: req.params.playerId
    };


    const insert = (await db.query('INSERT INTO chat SET ?', obj))[0];
    res.json({});

});

app.post('/board/:roomId/rematch', async (req, res) => {
    if (!req.params.roomId || !req.body) {
        res.status(400).end();
    }

    const insert = (await db.query(`UPDATE room SET ${req.body.player} = ${req.body.value} where id = ?`, [req.params.roomId]))[0];

    res.json({});
});

app.get('/rooms/:id', async (req, res) => {
    const roomId = req.params.id;
    if (roomId) {
        const get = (await db.execute('SELECT * FROM room WHERE id = ?', [roomId]))[0][0];

        if (get) {
            res.json(get);
        } else {
            res.status(400).end();
        }
    } else {
        res.status(400).end();
    }
});

app.get('/rooms/:id/board', async (req, res) => {
    if (req.params.id) {
        const get = (await db.execute('SELECT * FROM room WHERE ID = ?', [req.params.id]))[0][0];

        if (get) {
            res.json(get);
        } else {
            res.status(400).end();
        }


    } else {
        res.status(400).end();
    }
});

module.exports = app;
