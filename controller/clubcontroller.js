
const Club = require('../model/club');

// GET ALL CLUBS
exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(clubs);

  } catch (error) {
    console.error('GET CLUBS ERROR:', error);

    res.status(500).json({
      message: 'Error fetching clubs',
      error: error.message
    });
  }
};

// CREATE CLUB
exports.createClub = async (req, res) => {
  try {
    const { name, description, category, icon } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({
        message: 'Please fill all required fields'
      });
    }

    const club = await Club.create({
      name,
      description,
      category,
      icon
    });

    res.status(201).json({
      message: 'Club created successfully',
      club
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error creating club',
      error: error.message
    });
  }
};

// UPDATE CLUB
exports.updateClub = async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id);

    if (!club) {
      return res.status(404).json({
        message: 'Club not found'
      });
    }

    await club.update(req.body);

    res.status(200).json({
      message: 'Club updated successfully',
      club
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error updating club',
      error: error.message
    });
  }
};

// DELETE CLUB
exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id);

    if (!club) {
      return res.status(404).json({
        message: 'Club not found'
      });
    }

    await club.destroy();

    res.status(200).json({
      message: 'Club deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error deleting club',
      error: error.message
    });
  }
};
