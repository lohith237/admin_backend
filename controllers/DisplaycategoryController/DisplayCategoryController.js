const DisplayCategory = require('../../models/DisplayCategory');
const SubCategory = require('../../models/SubCategory');
const { paginateAndSearch } = require('../../utils/pagination');

const createDisplayCategory = async (req, res) => {
  try {
    const {
      subcategory,
      name,
      description,
      sort = 0,
      status = 'active',
      is_suspended = false
    } = req.body;

    if (!name || !subcategory) {
      return res.status(400).json({ message: 'Subcategory ID and name are required' });
    }

    const subCatDoc = await SubCategory.findById(subcategory);
    if (!subCatDoc) {
      return res.status(400).json({ message: 'Invalid subcategory ID' });
    }

    const duplicate = await DisplayCategory.findOne({ name });
    if (duplicate) {
      return res.status(400).json({ message: 'Display category name already exists' });
    }

    const newDisplayCategory = await DisplayCategory.create({
      subcategory,
      name,
      description,
      sort,
      status,
      is_suspended
    });

    const result = await DisplayCategory.findById(newDisplayCategory._id).populate('subcategory');

    res.status(201).json({
      message: 'Display category created successfully',
      displayCategory: result
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating display category', error: err.message });
  }
};

const getAllDisplayCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const search = req.query.search || '';
    const status = req.query.status;
    const subcategory = req.query.subcategory;

    let filter = {};
    if (status) filter.status = status;
    if (subcategory) filter.subcategory = subcategory;

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

    const data = await paginateAndSearch(DisplayCategory, {
      page,
      pageSize,
      search,
      searchFields: ['name', 'description'],
      filter,
      sort: { sort: 1, createdAt: -1 },
      baseUrl,
      originalQuery: req.query,
      populate: ['subcategory']
    });

    res.status(200).json({
      count: data.total,
      next: data.next,
      previous: data.previous,
      results: data.results
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching display categories', error: err.message });
  }
};

const getDisplayCategoryById = async (req, res) => {
  try {
    const displayCategory = await DisplayCategory.findById(req.params.id).populate('subcategory');
    if (!displayCategory) {
      return res.status(404).json({ message: 'Display category not found' });
    }
    res.status(200).json({ displayCategory });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching display category', error: err.message });
  }
};

const updateDisplayCategory = async (req, res) => {
  try {
    const {
      subcategory,
      name,
      description,
      sort,
      status,
      is_suspended
    } = req.body;

    if (subcategory) {
      const isValidSubCategory = await SubCategory.findById(subcategory);
      if (!isValidSubCategory) {
        return res.status(400).json({ message: 'Invalid subcategory ID' });
      }
    }

    let updatedFields = {
      subcategory,
      name,
      description,
      sort,
      status,
      is_suspended
    };

    const updatedDoc = await DisplayCategory.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    ).populate('subcategory');

    if (!updatedDoc) {
      return res.status(404).json({ message: 'Display category not found' });
    }

    res.status(200).json({
      message: 'Display category updated successfully',
      displayCategory: updatedDoc
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating display category', error: err.message });
  }
};

const deleteDisplayCategory = async (req, res) => {
  try {
    const deletedDoc = await DisplayCategory.findByIdAndDelete(req.params.id);
    if (!deletedDoc) {
      return res.status(404).json({ message: 'Display category not found' });
    }
    res.status(200).json({ message: 'Display category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting display category', error: err.message });
  }
};

module.exports = {
  createDisplayCategory,
  getAllDisplayCategories,
  getDisplayCategoryById,
  updateDisplayCategory,
  deleteDisplayCategory
};
