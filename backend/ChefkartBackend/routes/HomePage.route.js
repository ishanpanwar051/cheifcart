const { createKitchen, getallHomeImage, getHomeById, updateHomePage, deletehomePage } = require('../controller/HomePage.Controller');

const router = require('express').Router();

router.post('/createHomePage', createKitchen)
router.get('/getAll', getallHomeImage);
router.get('/get/:id', getHomeById);
router.put('/update/:id',updateHomePage) ;
router.delete('/delete/:id', deletehomePage)
 


module.exports = router;