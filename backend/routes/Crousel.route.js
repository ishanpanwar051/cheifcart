const { createCrousel, getCrouselById, updateCrousel, deleteCrouselById, deleteCrousel, getAllCrousel } = require('../controller/Crousel.Controller');
const { verifyToken, isAdmin } = require('../middleware/AuthMiddleware');

const router = require('express').Router();

router.post('/createCrousel', verifyToken, isAdmin, createCrousel);
router.get('/get', getAllCrousel);
router.get('/get/:id', getCrouselById);
router.put('/update/:id', verifyToken, isAdmin, updateCrousel);
router.delete('/delete/:id', verifyToken, isAdmin, deleteCrouselById);
router.delete('/delete', verifyToken, isAdmin, deleteCrousel);
module.exports = router;
