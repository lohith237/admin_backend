const SubCategory = require('../../models/SubCategory');
const Category = require('../../models/Category');
const { paginateAndSearch } = require('../../utils/pagination');

const createSubCategory = async (req, res) => {
  try {
    const {
      category,
      name,
      slug,
      description,
      meta_title,
      meta_keyword,
      meta_description,
      sort = 0,
      status = 'active',
      is_suspended = false
    } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category ID are required' });
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const duplicateName = await SubCategory.findOne({ name });
    if (duplicateName) {
      return res.status(400).json({ message: 'Subcategory name already exists' });
    }

    const duplicateSlug = await SubCategory.findOne({ slug });
    if (duplicateSlug) {
      return res.status(400).json({ message: 'Subcategory slug already exists' });
    }

    const newSubCategory = await SubCategory.create({
      category,
      name,
      slug,
      description,
      meta_title,
      meta_keyword,
      meta_description,
      sort,
      status,
      is_suspended,
      image
    });

    const result = await SubCategory.findById(newSubCategory._id).populate('category');

    res.status(201).json({
      message: 'Subcategory created successfully',
      subCategory: result
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating subcategory', error: err.message });
  }
};


const getAllSubCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const search = req.query.search || '';
    const status = req.query.status;
     const category = req.query.category||""
    let filter = {};
    if (status) {
      filter.status = status;
    }
    if(category){
      filter.category=category
    }
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    const data = await paginateAndSearch(SubCategory, {
      page,
      pageSize,
      search,
      searchFields: ['name', 'slug', 'description', 'meta_title', 'meta_keyword', 'meta_description'],
      filter,
      sort: { createdAt: -1 },
      baseUrl,
      originalQuery: req.query,
      populate: ['category']
    });

    res.status(200).json({
      count: data.total,
      next: data.next,
      previous: data.previous,
      results: data.results
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching subcategories', error: err.message });
  }
};

const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate('category');
    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.status(200).json({ subCategory });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching subcategory', error: err.message });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const {
      category,
      name,
      slug,
      description,
      meta_title,
      meta_keyword,
      meta_description,
      sort,
      status,
      is_suspended
    } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (category) {
      const isValidCategory = await Category.findById(category);
      if (!isValidCategory) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
    }

    let updatedFields = {
      category,
      name,
      slug,
      description,
      meta_title,
      meta_keyword,
      meta_description,
      sort,
      status,
      is_suspended
    };

    if (image) {
      updatedFields.image = image;
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true });

    if (!updatedSubCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.status(200).json({ message: 'Subcategory updated successfully', subCategory: updatedSubCategory });
  } catch (err) {
    res.status(500).json({ message: 'Error updating subcategory', error: err.message });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deletedSubCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting subcategory', error: err.message });
  }
};

module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory
};
