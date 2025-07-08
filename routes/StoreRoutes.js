const express = require('express');
const upload = require('../middleware/multer');
const {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore
} = require('../controllers/StoreController/StoreController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

const multiImageUpload = upload.fields([
  { name: 'logo_image', maxCount: 1 },
  { name: 'banner_image', maxCount: 1 }
]);

router.post('/', multiImageUpload, authMiddleware, adminMiddleware, createStore);
router.patch('/:id', multiImageUpload, authMiddleware,updateStore);
router.get('/',authMiddleware, adminMiddleware, getAllStores);
router.get('/:id',authMiddleware,getStoreById);
router.delete('/:id', authMiddleware, adminMiddleware, deleteStore);

module.exports = router;
