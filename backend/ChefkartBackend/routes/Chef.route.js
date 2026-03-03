const { createChef, getAllChef, getById, updateChef, deleteCheftById, DeleteAllChef, searchChefs } = require('../controller/Chefs.Controller');

const router = require('express').Router();

/**
 * @swagger
 * /chef/create:
 *   post:
 *     summary: Create a new chef
 *     tags: [Chefs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - city
 *     responses:
 *       201:
 *         description: Chef created successfully
 */
router.post('/create',createChef  );

/**
 * @swagger
 * /chef/get:
 *   get:
 *     summary: Get all chefs
 *     tags: [Chefs]
 *     responses:
 *       200:
 *         description: List of all chefs
 */
router.get('/get',  getAllChef);

/**
 * @swagger
 * /chef/search:
 *   get:
 *     summary: Search chefs with filters
 *     tags: [Chefs]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for name, city, or description
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum rating filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *     responses:
 *       200:
 *         description: Search results with pagination
 */
router.get('/search', searchChefs);

/**
 * @swagger
 * /chef/get/{id}:
 *   get:
 *     summary: Get chef by ID
 *     tags: [Chefs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chef details
 *       404:
 *         description: Chef not found
 */
router.get('/get/:id', getById);

/**
 * @swagger
 * /chef/update/{id}:
 *   put:
 *     summary: Update chef
 *     tags: [Chefs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chef updated successfully
 */
router.put('/update/:id',updateChef) ;

/**
 * @swagger
 * /chef/delete/{id}:
 *   delete:
 *     summary: Delete chef by ID
 *     tags: [Chefs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chef deleted successfully
 */
router.delete('/delete/:id', deleteCheftById)

/**
 * @swagger
 * /chef/delete:
 *   delete:
 *     summary: Delete all chefs
 *     tags: [Chefs]
 *     responses:
 *       200:
 *         description: All chefs deleted successfully
 */
router.delete('/delete', DeleteAllChef)
module.exports = router;
