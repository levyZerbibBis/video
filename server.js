const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Database connection
const db = new sqlite3.Database('./streams.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Initialize database tables
        const fs = require('fs');
        const initSQL = fs.readFileSync('db.sql', 'utf8');
        db.exec(initSQL, (err) => {
            if (err) {
                console.error('Error initializing database:', err);
            } else {
                console.log('Database initialized successfully');
            }
        });
    }
});

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/broadcast', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'broadcast.html'));
});

app.get('/live/:streamId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'live.html'));
});

// API Routes
app.get('/api/streams', (req, res) => {
    db.all('SELECT streams.*, users.username FROM streams JOIN users ON streams.user_id = users.id WHERE status = ?', ['live'], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// WebRTC signaling
const peers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('start-stream', async (data) => {
        const streamId = uuidv4();
        peers.set(streamId, { broadcaster: socket.id });
        
        // Update database
        db.run('UPDATE streams SET status = ? WHERE id = ?', ['live', data.streamId], (err) => {
            if (err) {
                console.error('Error updating stream status:', err);
            }
        });

        socket.emit('stream-started', { streamId });
    });

    socket.on('join-stream', (streamId) => {
        const peer = peers.get(streamId);
        if (peer) {
            socket.to(peer.broadcaster).emit('viewer-joined', { viewerId: socket.id });
        }
    });

    socket.on('signal', (data) => {
        const { to, signal } = data;
        io.to(to).emit('signal', {
            from: socket.id,
            signal: signal
        });
    });

    socket.on('disconnect', () => {
        // Clean up when broadcaster disconnects
        for (const [streamId, peer] of peers.entries()) {
            if (peer.broadcaster === socket.id) {
                peers.delete(streamId);
                db.run('UPDATE streams SET status = ? WHERE id = ?', ['off', streamId]);
            }
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 