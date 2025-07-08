const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        discount_percentage: {
            type: Number,
            default: 0,
        },
        image: {
            type: [String],
            default: [],
        },
        price: {
            type: String,
            required: true,
        },
        min_qty: {
            type: Number,
            default: 1,
        },
        max_qty: {
            type: Number,
            default: 1,
        },
        offer_price: {
            type: String,
            default: "0.00",
        },
        weight: {
            type: String,
        },
        measurement_unit: {
            type: String,
        },
        slug: {
            type: String,
        },
        meta_title: {
            type: String,
        },
        meta_description: {
            type: String,
        },
        meta_keyword: {
            type: String,
        },
        specification: {
            type: String,
            default: null,
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Brands",
            default: null,
        },
        track_inventry: {
            type: Boolean,
            default: null,
        },
        sort: {
            type: Number,
            default: 0,
        },
        tax_classification: {
            type: String,
            default: null,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        subcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', ProductSchema);