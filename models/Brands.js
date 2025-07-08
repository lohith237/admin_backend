const mongoose = require('mongoose');

const BrandScheema= new mongoose.Schema(
  {
    image: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      unique: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Brands', BrandScheema);
