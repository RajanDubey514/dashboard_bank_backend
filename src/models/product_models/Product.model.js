import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    product_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    product_size: {
      type: String,
      trim: true,
    },

    product_length: {
      type: String,
      trim: true,
    },

    product_manufactured_brand: {
      type: String,
      trim: true,
    },

    product_HSN_code: {
      type: String,
      trim: true,
    },

    product_sale_price: {
      type: Number,
      required: true,
      default: 0,
    },

    product_purchase_price: {
      type: Number,
      required: true,
      default: 0,
    },

    product_reorder_Qty: {
      type: Number,
      default: 0,
    },

    product_minimum_reorder_Qty: {
      type: Number,
      default: 0,
    },

    product_cgst: {
      type: Number,
      default: 0,
    },

    product_sgst: {
      type: Number,
      default: 0,
    },

    product_igst: {
      type: Number,
      default: 0,
    },

    // Main Group
    group_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductGroup",
      required: true,
    },

    // Sub Group
    sub_group_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductSubGroup",
      required: true,
    },

    // Product Type
    product_type_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },

    // Assembly Type
    assembly_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductAssemblyType",
      required: true,
    },

    // UOM
    sale_uom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UOM",
      required: true,
    },

    purchase_uom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UOM",
      required: true,
    },

    serial_applicable: {
      type: Boolean,
      default: false,
    },

    gst_expt: {
      type: Boolean,
      default: false,
    },

    status: {
      type: Boolean,
      default: true,
    },

    // optional image
    product_img: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);