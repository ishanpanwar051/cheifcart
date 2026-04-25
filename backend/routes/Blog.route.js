const { createBlog, getallBlogs, getBlogById, updateBlog, deleteBlog } = require('../controller/Blog.Controller');
const { verifyToken, isAdmin } = require('../middleware/AuthMiddleware');

const router = require('express').Router();

router.post('/create', verifyToken, isAdmin, createBlog)
router.get('/getAll', getallBlogs);
router.get('/get/:id', getBlogById);
router.put('/update/:id', verifyToken, isAdmin, updateBlog) ;
router.delete('/delete/:id', verifyToken, isAdmin, deleteBlog)
 


module.exports = router;