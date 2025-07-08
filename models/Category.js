const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    image: { 
      type: String, 
      default: null 
    },
    name: { 
      type: String, 
      required: true, 
      unique: true 
    },
    sort: { 
      type: Number, 
      default: 0 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true 
    },
    meta_title: { 
      type: String, 
      default: null 
    },
    meta_keyword: { 
      type: String, 
      default: null 
    },
    meta_description: { 
      type: String, 
      default: null 
    },
    description: { 
      type: String, 
      default: null 
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active' 
    },
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model('Category', categorySchema);
