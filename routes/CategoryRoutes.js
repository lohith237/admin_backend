const express = require('express');
const upload = require('../middleware/multer');
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/CategoryController/CategoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', upload.single('image'),authMiddleware,adminMiddleware, createCategory);
router.patch('/:id', upload.single('image'), authMiddleware,adminMiddleware, updateCategory);
router.get('/',getAllCategories);
router.get('/:id', authMiddleware, getCategoryById);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
