const express = require('express');
const upload = require('../middleware/multer');
const {
  syncInventoryToStore,
  getStoreByInventory
} = require('../controllers/InentoryController/InventoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/sync/:storeId',authMiddleware, adminMiddleware, syncInventoryToStore);
router.get('/store-wise-inventory',authMiddleware, adminMiddleware, getStoreByInventory);
module.exports = router;
