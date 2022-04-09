const { check } = require('express-validator');
const movieController = require('../controllers/movie-controller');
const express = require('express');
const router = express.Router();
const auth  = require('../middleware/auth')

const {
    createMovie,
    getMovieById,
    getAllMovies,
    updateMovie,
    deleteMovie } = movieController;

const validation = [ 
    check('title').not().isEmpty(),
     check('description').not().isEmpty(),
     check('creator').not().isEmpty()]

    
//movie-routes.js
// CREATE MOVIE 
router.post('/',[auth, validation],createMovie);

// UPDATE MOVIE 
router.patch('/:id',[auth, validation],updateMovie);

// DELETE MOVIE 
router.delete('/:id',auth, deleteMovie);

// // CREATE MOVIE 
// router.post('/',validation,createMovie);

// GET MOVIE BY ID 
router.get('/:id',getMovieById);

// GET ALL MOVIES
router.get('/',getAllMovies);

// // UPDATE MOVIE 
// router.patch('/:id',validation,updateMovie);

// // DELETE MOVIE 
// router.delete('/:id',deleteMovie);

module.exports = router;