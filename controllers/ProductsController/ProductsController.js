const mongoose = require('mongoose');
const Product = require('../../models/Products');
const Category = require('../../models/Category');
const SubCategory = require('../../models/SubCategory');
const Brand = require('../../models/Brands');
const { paginateAndSearch } = require('../../utils/pagination');

const validateMongoId = async (id, model, label) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error(`Invalid ${label} ID`);
  const exists = await model.findById(id);
  if (!exists) throw new Error(`${label} not found`);
};
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      discount_percentage = 0,
      price,
      offer_price = '0.00',
      min_qty = 0,
      max_qty = 0,
      weight,
      measurement_unit,
      slug,
      meta_title,
      meta_description,
      meta_keyword,
      specification,
      brand,
      track_inventry = false,
      sort = 0,
      tax_classification,
      category,
      subcategory
    } = req.body;

    const image = req.files?.map(file => `/uploads/${file.filename}`) || [];
    if (!name || !price || !category || !subcategory) {
      return res.status(400).json({ message: 'Name, price, category, and subcategory are required.' });
    }

    const existingName = await Product.findOne({ name });
    if (existingName) {
      return res.status(400).json({ message: 'Product name already exists' });
    }

    if (slug) {
      const existingSlug = await Product.findOne({ slug });
      if (existingSlug) {
        return res.status(400).json({ message: 'Product slug already exists' });
      }
    }

    await validateMongoId(category, Category, 'Category');
    await validateMongoId(subcategory, SubCategory, 'SubCategory');
    if (brand) await validateMongoId(brand, Brand, 'Brand');

    const newProduct = new Product({
      name,
      description,
      discount_percentage,
      image,
      price,
      min_qty,
      max_qty,
      offer_price,
      weight,
      measurement_unit,
      slug,
      meta_title,
      meta_description,
      meta_keyword,
      specification,
      brand: brand || null,
      track_inventry,
      sort,
      tax_classification,
      category,
      subcategory
    });

    await newProduct.save();

    return res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    return res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const subcategory = req.query.subcategory || '';
    const brand = req.query.brand || '';
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    if (brand) {
      filter.brand = brand;
    }
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    const data = await paginateAndSearch(Product, {
      page,
      pageSize,
      search,
      searchFields: ['name', 'slug', 'description', 'meta_title', 'meta_keyword', 'meta_description'],
      filter:filter,
      sort: { createdAt: -1 },
      baseUrl,
      originalQuery: req.query,
      populate: ['brand', 'category', 'subcategory']
    });

    res.status(200).json({
      count: data.total,
      next: data.next,
      previous: data.previous,
      results: data.results
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('brand category subcategory');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      discount_percentage,
      price,
      offer_price,
      min_qty,
      max_qty,
      weight,
      measurement_unit,
      slug,
      meta_title,
      meta_description,
      meta_keyword,
      specification,
      brand,
      track_inventry,
      sort,
      tax_classification,
      category,
      subcategory
    } = req.body;

    const image = req.files?.map(file => `/uploads/${file.filename}`) || [];

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (category) await validateMongoId(category, Category, 'Category');
    if (subcategory) await validateMongoId(subcategory, SubCategory, 'SubCategory');
    if (brand) await validateMongoId(brand, Brand, 'Brand');

    const updatedFields = {
      name,
      description,
      discount_percentage,
      price,
      min_qty,
      max_qty,
      offer_price,
      weight,
      measurement_unit,
      slug,
      meta_title,
      meta_description,
      meta_keyword,
      specification,
      brand: brand || null,
      track_inventry,
      sort,
      tax_classification,
      category,
      subcategory
    };

    if (image.length > 0) updatedFields.image = image;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
