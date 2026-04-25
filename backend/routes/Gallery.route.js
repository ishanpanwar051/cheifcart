const { createGallery, getAllGallery, deleteGallery } = require('../controller/Gallery.Controller');
const { verifyToken, isAdmin } = require('../middleware/AuthMiddleware');

const router = require('express').Router();

router.post('/create', verifyToken, isAdmin, createGallery)
router.get('/getAll', getAllGallery);
router.delete('/delete/:id', verifyToken, isAdmin, deleteGallery)


module.exports = router;
