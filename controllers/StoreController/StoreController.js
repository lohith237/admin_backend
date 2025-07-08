const bcrypt = require('bcrypt');
const Store = require('../../models/Store');
const User = require('../../models/userModel');
const { paginateAndSearch } = require('../../utils/pagination');

const createStore = async (req, res) => {
  try {
    const {
      name,
      address,
      latitude,
      longitude,
      email,
      is_suspended = false,
      is_default = false,
      is_online = 'offline',
      opens_at,
      closes_at,
      mobileno,
      password
    } = req.body;

    const logo_image = req.files?.logo_image?.[0]?.filename
      ? `/uploads/${req.files.logo_image[0].filename}`
      : null;

    const banner_image = req.files?.banner_image?.[0]?.filename
      ? `/uploads/${req.files.banner_image[0].filename}`
      : null;

    if (!name || !address || !latitude || !longitude || !mobileno || !password) {
      return res.status(400).json({
        message: 'Name, address, latitude, longitude, mobileno and password are required'
      });
    }

    const existingUser = await User.findOne({ phoneNumber: mobileno });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      phoneNumber: mobileno,
      email: email || null,
      password: hashedPassword,
      role: 'vendor'
    });

    const newStore = await Store.create({
      name,
      address,
      latitude,
      longitude,
      email,
      is_suspended,
      is_default,
      is_online,
      opens_at,
      closes_at,
      mobileno,
      password: hashedPassword,
      logo_image,
      banner_image
    });

    res.status(201).json({
      message: 'Store and vendor user created successfully',
      store: newStore,
      user: newUser
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error creating store',
      error: err.message
    });
  }
};

const getAllStores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const search = req.query.search || '';
    const filter = {};

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    const data = await paginateAndSearch(Store, {
      page,
      pageSize,
      search,
      searchFields: ['name', 'email', 'address'],
      filter,
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
    res.status(500).json({ message: 'Error fetching stores', error: err.message });
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json({ store });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching store', error: err.message });
  }
};

const updateStore = async (req, res) => {
  try {
    const {
      name,
      address,
      latitude,
      longitude,
      email,
      is_suspended,
      is_default,
      is_online,
      opens_at,
      closes_at,
      mobileno,
      password
    } = req.body;

    const logo_image = req.files?.logo_image?.[0]?.filename
      ? `/uploads/${req.files.logo_image[0].filename}`
      : null;

    const banner_image = req.files?.banner_image?.[0]?.filename
      ? `/uploads/${req.files.banner_image[0].filename}`
      : null;

    const updatedFields = {
      name,
      address,
      latitude,
      longitude,
      email,
      is_suspended,
      is_default,
      is_online,
      opens_at,
      closes_at,
      mobileno
    };

    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }
    if (logo_image) updatedFields.logo_image = logo_image;
    if (banner_image) updatedFields.banner_image = banner_image;

    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedStore) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json({
      message: 'Store updated successfully',
      store: updatedStore
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error updating store',
      error: err.message
    });
  }
};

const deleteStore = async (req, res) => {
  try {
    const deletedStore = await Store.findByIdAndDelete(req.params.id);
    if (!deletedStore) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting store', error: err.message });
  }
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore
};
