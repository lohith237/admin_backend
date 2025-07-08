const Category = require('../../models/Category');
const { paginateAndSearch } = require('../../utils/pagination');

const createCategory = async (req, res) => {
  try {
    const { name, slug, description, meta_title, meta_keyword, meta_description, sort = 0, status = 'active' } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    const newCategory = new Category({
      name,
      slug,
      description,
      meta_title,
      meta_keyword,
      meta_description,
      sort,
      status,
      image
    });

    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (err) {
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const search = req.query.search || '';
    const status = req.query.status;
    let filter = {};
    if (status) {
      filter.status = status;  
    }
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    const data = await paginateAndSearch(Category, {
      page,
      pageSize,
      search,
      searchFields: ['name', 'slug', 'description', 'meta_title', 'meta_keyword', 'meta_description'],
      filter:filter,
      sort: { createdAt: -1 },
      baseUrl,
      originalQuery: req.query
    });

    res.status(200).json({
      count: data.total,
      next: data.next,
      previous: data.previous,
      results: data.results
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ category });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category', error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, slug, description, meta_title, meta_keyword, meta_description, sort, status } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    let updatedFields = { name, slug, description, meta_title, meta_keyword, meta_description, sort, status };

    if (image) {
      updatedFields.image = image;
    }

    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (err) {
    res.status(500).json({ message: 'Error updating category', error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
};

module.exports = { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
