const express = require('express');
const upload = require('../middleware/multer');
const {
  createDisplayCategory,
  getAllDisplayCategories,
  getDisplayCategoryById,
  updateDisplayCategory,
  deleteDisplayCategory
} = require('../controllers/DisplaycategoryController/DisplayCategoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/',authMiddleware, adminMiddleware, createDisplayCategory);
router.patch('/:id',authMiddleware, adminMiddleware, updateDisplayCategory);
router.get('/', getAllDisplayCategories);
router.get('/:id', authMiddleware, getDisplayCategoryById);
router.delete('/:id', authMiddleware, adminMiddleware, deleteDisplayCategory);

module.exports = router;
