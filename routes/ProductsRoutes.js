const express = require('express');
const upload = require('../middleware/multer');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/ProductsController/ProductsController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', upload.array('image'), authMiddleware, adminMiddleware, createProduct);
router.patch('/:id', upload.array('image'), authMiddleware, adminMiddleware, updateProduct);
router.get('/', getAllProducts);
router.get('/:id', authMiddleware, getProductById);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
