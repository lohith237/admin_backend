const express = require('express');
const upload = require('../middleware/multer');
const {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand
} = require('../controllers/BrandsController/BrandsController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', upload.single('image'), authMiddleware, adminMiddleware, createBrand);
router.patch('/:id', upload.single('image'), authMiddleware, adminMiddleware, updateBrand);
router.get('/', getAllBrands);
router.get('/:id', authMiddleware, getBrandById);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBrand);

module.exports = router;
