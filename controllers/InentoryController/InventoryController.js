const Product = require('../../models/Products');
const Inventory = require('../../models/Inventory');
const { paginateAndSearch } = require('../../utils/pagination');
const syncInventoryToStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const products = await Product.find({}, '_id price offer_price').lean();
    const existing = await Inventory.find({ store: storeId }, 'product').lean();
    const existingProductIds = new Set(existing.map(item => item.product.toString()));

    const bulkOps = products
      .filter(product => !existingProductIds.has(product._id.toString()))
      .map(product => ({
        insertOne: {
          document: {
            store: storeId,
            product: product._id,
            price: product.price,
            offer_price:product.offer_price,
            qty: 0
          }
        }
      }));

    if (bulkOps.length > 0) {
      await Inventory.bulkWrite(bulkOps, { ordered: false });
    }

    return res.status(200).json({
      isNewStore: existing.length === 0,
      syncedCount: bulkOps.length,
      message: `✅ Synced ${bulkOps.length} product(s) to store inventory.`
    });
  } catch (err) {
    return res.status(500).json({ message: 'Inventory sync failed', error: err.message });
  }
};
const getStoreByInventory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const search = req.query.search || '';
    const store = req.query.store;
    let filter = {};
    if (!store) {
      return res.status(200).json({
        count: 0,
        next: null,
        previous: null,
        results: []
      });
    }
    if (store) filter.store = store;

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

    const data = await paginateAndSearch(Inventory, {
      page,
      pageSize,
      search,
      searchFields: [],
      filter,
      sort: { createdAt: -1 },
      baseUrl,
      originalQuery: req.query,
      populate: ['product']
    });

    res.status(200).json({
      count: data.total,
      next: data.next,
      previous: data.previous,
      results: data.results
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching store inventory', error: err.message });
  }
};
const upDateStoreWiseProduct=async(req,res)=>{
   const {price,offer_price,qty,isActive}=req.body
   const updatedFields={
    price,offer_price,qty,isActive
   }
   const updatedInventory= await Inventory.findByIdAndUpdate(req.params.id,{$set:updatedFields},{new:true})
  if (!updatedInventory) {
      return res.status(400).json({ message: "Inventory not found" });
    }

    return res.status(200).json({
      message: 'Store inventory updated successfully',
      store: updatedInventory
    });
}
const DeleteStoreWiseProduct = async (req, res) => {
  try {
    const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);

    if (!deletedInventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    return res.status(200).json({
      message: "Store inventory deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while deleting inventory",
      error: error.message,
    });
  }
};

module.exports = {
  syncInventoryToStore,
  getStoreByInventory,
  upDateStoreWiseProduct,
  DeleteStoreWiseProduct
};
