const Brand = require('../../models/Brands');
const { paginateAndSearch } = require('../../utils/pagination');

const createBrand = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ message: 'Brand name already exists' });
    }

    const existingSlug = await Brand.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ message: 'Brand with this slug already exists' });
    }

    const newBrand = new Brand({
      name,
      slug,
      image
    });

    await newBrand.save();
    res.status(201).json({ message: 'Brand created successfully', brand: newBrand });
  } catch (err) {
    res.status(500).json({ message: 'Error creating brand', error: err.message });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const search = req.query.search || '';

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    const data = await paginateAndSearch(Brand, {
      page,
      pageSize,
      search,
      searchFields: ['name', 'slug'],
      filter: {},
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
    res.status(500).json({ message: 'Error fetching brands', error: err.message });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json({ brand });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching brand', error: err.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    let updatedFields = { name, slug };
    if (image) {
      updatedFields.image = image;
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(200).json({ message: 'Brand updated successfully', brand: updatedBrand });
  } catch (err) {
    res.status(500).json({ message: 'Error updating brand', error: err.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting brand', error: err.message });
  }
};

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand
};
