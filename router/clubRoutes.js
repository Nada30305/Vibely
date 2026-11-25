
const express = require('express');
const router = express.Router();

const {
  getClubs,
  createClub,
  updateClub,
  deleteClub
} = require('../controller/clubcontroller');

const verifyToken = require('../middelware/authMiddleware');

// GET ALL CLUBS
router.get('/', verifyToken, getClubs);

// CREATE CLUB
router.post('/', verifyToken, createClub);

// UPDATE CLUB
router.put('/:id', verifyToken, updateClub);

// DELETE CLUB
router.delete('/:id', verifyToken, deleteClub);

module.exports = router;
