
const db = require('../config/db');

const getAdminStats = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT COUNT(*) AS totalUsers FROM users'
    );

    const [events] = await db.query(
      'SELECT COUNT(*) AS totalEvents FROM events'
    );

    const [reservations] = await db.query(`
      SELECT
        COUNT(*) AS totalReservations,
        SUM(CASE WHEN status = 'booked' THEN 1 ELSE 0 END) AS bookedReservations,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelledReservations
      FROM tickets
    `);

    res.status(200).json({
      success: true,
      totalUsers: users[0].totalUsers,
      totalEvents: events[0].totalEvents,
      totalReservations: reservations[0].totalReservations,
      bookedReservations: reservations[0].bookedReservations || 0,
      cancelledReservations: reservations[0].cancelledReservations || 0
    });

  } catch (error) {
    console.error('Admin statistics error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load admin statistics'
    });
  }
};

module.exports = { getAdminStats };
