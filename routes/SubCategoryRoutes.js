const express = require('express');
const upload = require('../middleware/multer');
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory
} = require('../controllers/SubcategoryController/SubCategoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', upload.single('image'), authMiddleware, adminMiddleware, createSubCategory);
router.patch('/:id', upload.single('image'), authMiddleware, adminMiddleware, updateSubCategory);
router.get('/', getAllSubCategories);
router.get('/:id', authMiddleware, getSubCategoryById);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSubCategory);

module.exports = router;
