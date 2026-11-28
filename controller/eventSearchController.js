const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');

const searchEvents = async (req, res) => {
    try {
        const keyword = typeof req.query.keyword === 'string'
            ? req.query.keyword.trim()
            : '';

        const date = typeof req.query.date === 'string'
            ? req.query.date.trim()
            : '';

        const category = typeof req.query.category === 'string'
            ? req.query.category.trim()
            : '';

        const sort = typeof req.query.sort === 'string'
            ? req.query.sort.trim()
            : 'date';

        // Validate date
        if (date) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (!dateRegex.test(date)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Use YYYY-MM-DD.'
                });
            }

            const parsedDate = new Date(date + 'T00:00:00Z');

            if (
                Number.isNaN(parsedDate.getTime()) ||
                parsedDate.toISOString().slice(0, 10) !== date
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid calendar date.'
                });
            }
        }

        // Validate sorting
        if (!['date', 'popular', 'popularity'].includes(sort)) {
            return res.status(400).json({
                success: false,
                message: 'Sort must be date or popularity.'
            });
        }

        // SQL conditions
        const conditions = [
            "e.status = 'published'"
        ];

        const replacements = {};

        // Search by keyword
        if (keyword) {
            conditions.push(`
                (
                    e.title LIKE :keyword
                    OR e.description LIKE :keyword
                    OR e.category LIKE :keyword
                    OR v.name LIKE :keyword
                    OR v.location LIKE :keyword
                )
            `);

            replacements.keyword = `%${keyword}%`;
        }

        // Filter by date
        if (date) {
            conditions.push('DATE(e.start_date) = :date');
            replacements.date = date;
        }

        // Filter by category
        if (category && category !== 'All') {
            conditions.push('e.category = :category');
            replacements.category = category;
        }

        const whereClause = conditions.join(' AND ');

        // Sort by date or popularity
        const orderClause = ['popular', 'popularity'].includes(sort)
        ? 'popularity DESC, e.start_date ASC'
        : 'e.start_date ASC';
        // Main SQL query
        const sql = `
            SELECT
                e.id,
                e.title,
                e.description,
                e.category,
                e.start_date,
                e.end_date,
                e.capacity,
                e.available_seats,
                e.status,
                v.name AS venue_name,
                v.location AS location,
                COALESCE(t.popularity, 0) AS popularity

            FROM events e

            LEFT JOIN venues v
                ON e.venue_id = v.id

            LEFT JOIN (
                SELECT
                    event_id,
                    COUNT(*) AS popularity
                FROM tickets
                WHERE status = 'booked'
                GROUP BY event_id
            ) t
                ON e.id = t.event_id

            WHERE ${whereClause}

            ORDER BY ${orderClause}
        `;

        const events = await sequelize.query(sql, {
            replacements,
            type: QueryTypes.SELECT
        });

        return res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });

    } catch (error) {
        console.error('Search error:', error);

        return res.status(500).json({
            success: false,
            message: 'Error searching events',
            error: error.message
        });
    }
};

module.exports = {
    searchEvents
};
