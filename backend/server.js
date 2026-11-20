const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Vibely API is running!');
});

// GET ALL VENUES
app.get('/venues', async (req, res) => {
    try {
        const [venues] = await db.query('SELECT * FROM venues');
        res.status(200).json(venues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE EVENT
app.post('/events', async (req, res) => {
    try {
        console.log('POST /events received:', req.body);
        const {
            club_id,
            venue_id,
            created_by,
            title,
            description,
            category,
            start_date,
            end_date,
            capacity,
            status
        } = req.body;

        if (!club_id || !venue_id || !created_by ||
            !title || !start_date || !end_date ||
            !capacity || capacity <= 0) {
            return res.status(400).json({
                message: 'Please provide all required fields.'
            });
        }

        const [venues] = await db.query(
            'SELECT * FROM venues WHERE id = ?',
            [venue_id]
        );

        if (venues.length === 0) {
            return res.status(404).json({
                message: 'Venue not found.'
            });
        }

        if (Number(capacity) > venues[0].capacity) {
            return res.status(400).json({
                message: 'Event capacity exceeds venue capacity.'
            });
        }

        const [result] = await db.query(
            `INSERT INTO events
            (club_id, venue_id, created_by, title, description,
             category, start_date, end_date, capacity,
             available_seats, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                club_id,
                venue_id,
                created_by,
                title,
                description || null,
                category || null,
                start_date,
                end_date,
                capacity,
                capacity,
                status || 'draft'
            ]
        );

        const [newEvent] = await db.query(
            'SELECT * FROM events WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(newEvent[0]);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET ALL EVENTS
app.get('/events', async (req, res) => {
    console.log('GET /events RECEIVED');
    try {
        const [events] = await db.query(
            `SELECT events.*, venues.name AS venue_name
             FROM events
             LEFT JOIN venues ON events.venue_id = venues.id
             ORDER BY events.id DESC`
        );

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET EVENT BY ID
app.get('/events/:id', async (req, res) => {
    try {
        const [events] = await db.query(
            'SELECT * FROM events WHERE id = ?',
            [req.params.id]
        );

        if (events.length === 0) {
            return res.status(404).json({
                message: 'Event not found.'
            });
        }

        res.status(200).json(events[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE EVENT
app.put('/events/:id', async (req, res) => {
    try {
        const {
            venue_id,
            title,
            description,
            category,
            start_date,
            end_date,
            capacity,
            status
        } = req.body;

        if (!venue_id || !title || !start_date ||
            !end_date || !capacity || capacity <= 0) {
            return res.status(400).json({
                message: 'Please provide all required fields.'
            });
        }

        const [venues] = await db.query(
            'SELECT * FROM venues WHERE id = ?',
            [venue_id]
        );

        if (venues.length === 0) {
            return res.status(404).json({
                message: 'Venue not found.'
            });
        }

        if (Number(capacity) > venues[0].capacity) {
            return res.status(400).json({
                message: 'Event capacity exceeds venue capacity.'
            });
        }

        const [result] = await db.query(
            `UPDATE events SET
             venue_id = ?, title = ?, description = ?,
             category = ?, start_date = ?, end_date = ?,
             capacity = ?, available_seats = ?, status = ?
             WHERE id = ?`,
            [
                venue_id,
                title,
                description || null,
                category || null,
                start_date,
                end_date,
                capacity,
                capacity,
                status || 'draft',
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Event not found.'
            });
        }

        res.status(200).json({
            message: 'Event updated successfully.'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE EVENT
app.delete('/events/:id', async (req, res) => {
    try {
        console.log('POST /events received:', req.body);
        const [result] = await db.query(
            'DELETE FROM events WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Event not found.'
            });
        }

        res.status(200).json({
            message: 'Event deleted successfully.'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});