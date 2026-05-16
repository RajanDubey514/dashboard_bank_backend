import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

import { Product } from "../../models/product_models/Product.model.js";
import { ProductGroup } from "../../models/product_models/MainGroup.model.js";
import { ProductSubGroup } from "../../models/product_models/SubGroup.model.js";
import { ProductAssemblyType } from "../../models/product_models/AssemblyType.model.js";
import { UnitOfMeter } from "../../models/product_models/UnitMeter.model.js";
import { ProductType } from "../../models/product_models/ProductType.model.js";
import { uploadCloudinary } from "../../utils/cloudinary.js";

export const createProduct = asyncHandler(async (req , res) =>{
    const {
    product_name,
    product_code,
    product_size,
    product_length,
    product_manufactured_brand,
    product_HSN_code,
    product_sale_price,
    product_purchase_price,
    product_reorder_Qty,
    product_minimum_reorder_Qty,
    product_cgst,
    product_sgst,
    product_igst,
    group_name,
    sub_group_name,
    product_type_name,
    assembly_name,
    sale_uom,
    purchase_uom,
    serial_applicable,
    gst_expt,
    status,
  } = req.body;

  // required validation
   if (!product_name || product_name.trim() === "") {
    throw new ApiError(400, "Product name is required");
  }

  if (!product_code || product_code.trim() === "") {
    throw new ApiError(400, "Product code is required");
  }

  if (!group_name) {
    throw new ApiError(400, "Main Group is required");
  }

  if (!sub_group_name) {
    throw new ApiError(400, "Sub Group is required");
  }

  if (!product_type_name) {
    throw new ApiError(400, "Product Type is required");
  }

  if (!assembly_name) {
    throw new ApiError(400, "Assembly Type is required");
  }

  if (!sale_uom) {
    throw new ApiError(400, "Sale UOM is required");
  }

  if (!purchase_uom) {
    throw new ApiError(400, "Purchase UOM is required");
  }
 
   // DUPLICATE CHECK
   const existingProduct = await Product.findOne({
    $or:[
        { product_name : product_name.trim() },
        { product_code : product_code.trim() }
    ],
   });

    if (existingProduct) {
     throw new ApiError(409, "Product name or code already exists");
    }


    // MAIN GROUP CHECK
    const findMainGroup = await ProductGroup.findById(group_name);

    if (!findMainGroup) {
        throw new ApiError(404, "Main Group not found");
    }

    if (findMainGroup.status === false) {
        throw new ApiError(400, "Main Group is inactive");
    }


    // SUB GROUP CHECK
    const findSubGroup = await ProductSubGroup.findById(sub_group_name);

    if (!findSubGroup) {
        throw new ApiError(404, "Sub Group not found");
    }

    if (findSubGroup.status === false) {
        throw new ApiError(400, "Sub Group is inactive");
    }


     // PRODUCT TYPE CHECK
    const findProductType = await ProductType.findById(product_type_name);

    if (!findProductType) {
        throw new ApiError(404, "Product Type not found");
    }

    if (findProductType.status === false) {
        throw new ApiError(400, "Product Type is inactive");
    }
     

    // ASSEMBLY TYPE CHECK
    const findAssembly = await ProductAssemblyType.findById(assembly_name);

    if (!findAssembly) {
        throw new ApiError(404, "Assembly Type not found");
    }

    if (findAssembly.status === false) {
        throw new ApiError(400, "Assembly Type is inactive");
    }
    
    // SALE UOM CHECK
    const findSaleUOM = await UnitOfMeter.findById(sale_uom);

    if (!findSaleUOM) {
        throw new ApiError(404, "Sale UOM not found");
    }

    if (findSaleUOM.status === false) {
        throw new ApiError(400, "Sale UOM is inactive");
    }

    // PURCHASE UOM CHECK
    const findPurchaseUOM = await UnitOfMeter.findById(purchase_uom);

    if (!findPurchaseUOM) {
        throw new ApiError(404, "Purchase UOM not found");
    }

    if (findPurchaseUOM.status === false) {
        throw new ApiError(400, "Purchase UOM is inactive");
    }

    // CREATE PRODUCT
      const createProductData = await Product.create({
    product_name: product_name.trim(),
    product_code: product_code.trim(),
    product_size,
    product_length,
    product_manufactured_brand,
    product_HSN_code,
    product_sale_price,
    product_purchase_price,
    product_reorder_Qty,
    product_minimum_reorder_Qty,
    product_cgst,
    product_sgst,
    product_igst,
    group_name,
    sub_group_name,
    product_type_name,
    assembly_name,
    sale_uom,
    purchase_uom,
    serial_applicable: serial_applicable || false,
    gst_expt: gst_expt || false,
    status: status || true,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      createProductData,
      "Product created successfully"
    )
  );
})

export const updateProduct = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const {
    product_name,
    product_code,
    product_size,
    product_length,
    product_manufactured_brand,
    product_HSN_code,
    product_sale_price,
    product_purchase_price,
    product_reorder_Qty,
    product_minimum_reorder_Qty,
    product_cgst,
    product_sgst,
    product_igst,
    group_name,
    sub_group_name,
    product_type_name,
    assembly_name,
    sale_uom,
    purchase_uom,
    serial_applicable,
    gst_expt,
    status,
  } = req.body;

  // =========================
  // CHECK PRODUCT EXISTS
  // =========================

  const findProduct = await Product.findById(id);

  if (!findProduct) {
    throw new ApiError(404, "Product not found");
  }

  // =========================
  // DYNAMIC UPDATE OBJECT
  // =========================

  const updateData = {};

  // =========================
  // PRODUCT NAME
  // =========================

  if (product_name !== undefined) {

    if (product_name.trim() === "") {
      throw new ApiError(400, "Product name cannot be empty");
    }

    const existingProductName = await Product.findOne({
      product_name: product_name.trim(),
      _id: { $ne: id },
    });

    if (existingProductName) {
      throw new ApiError(409, "Product name already exists");
    }

    updateData.product_name = product_name.trim();
  }

  // =========================
  // PRODUCT CODE
  // =========================

  if (product_code !== undefined) {

    if (product_code.trim() === "") {
      throw new ApiError(400, "Product code cannot be empty");
    }

    const existingProductCode = await Product.findOne({
      product_code: product_code.trim(),
      _id: { $ne: id },
    });

    if (existingProductCode) {
      throw new ApiError(409, "Product code already exists");
    }

    updateData.product_code = product_code.trim();
  }

  // =========================
  // MAIN GROUP
  // =========================

  if (group_name !== undefined) {

    const findMainGroup = await ProductGroup.findById(group_name);

    if (!findMainGroup) {
      throw new ApiError(404, "Main Group not found");
    }

    if (findMainGroup.status === false) {
      throw new ApiError(400, "Main Group is inactive");
    }

    updateData.group_name = group_name;
  }

  // =========================
  // SUB GROUP
  // =========================

  if (sub_group_name !== undefined) {

    const findSubGroup = await ProductSubGroup.findById(sub_group_name);

    if (!findSubGroup) {
      throw new ApiError(404, "Sub Group not found");
    }

    if (findSubGroup.status === false) {
      throw new ApiError(400, "Sub Group is inactive");
    }

    updateData.sub_group_name = sub_group_name;
  }

  // =========================
  // PRODUCT TYPE
  // =========================

  if (product_type_name !== undefined) {

    const findProductType = await ProductType.findById(product_type_name);

    if (!findProductType) {
      throw new ApiError(404, "Product Type not found");
    }

    if (findProductType.status === false) {
      throw new ApiError(400, "Product Type is inactive");
    }

    updateData.product_type_name = product_type_name;
  }

  // =========================
  // ASSEMBLY TYPE
  // =========================

  if (assembly_name !== undefined) {

    const findAssembly = await ProductAssemblyType.findById(assembly_name);

    if (!findAssembly) {
      throw new ApiError(404, "Assembly Type not found");
    }

    if (findAssembly.status === false) {
      throw new ApiError(400, "Assembly Type is inactive");
    }

    updateData.assembly_name = assembly_name;
  }

  // =========================
  // SALE UOM
  // =========================

  if (sale_uom !== undefined) {

    const findSaleUOM = await UnitOfMeter.findById(sale_uom);

    if (!findSaleUOM) {
      throw new ApiError(404, "Sale UOM not found");
    }

    if (findSaleUOM.status === false) {
      throw new ApiError(400, "Sale UOM is inactive");
    }

    updateData.sale_uom = sale_uom;
  }

  // =========================
  // PURCHASE UOM
  // =========================

  if (purchase_uom !== undefined) {

    const findPurchaseUOM = await UnitOfMeter.findById(purchase_uom);

    if (!findPurchaseUOM) {
      throw new ApiError(404, "Purchase UOM not found");
    }

    if (findPurchaseUOM.status === false) {
      throw new ApiError(400, "Purchase UOM is inactive");
    }

    updateData.purchase_uom = purchase_uom;
  }

  // =========================
  // NORMAL FIELDS
  // =========================

  if (product_size !== undefined) {
    updateData.product_size = product_size;
  }

  if (product_length !== undefined) {
    updateData.product_length = product_length;
  }

  if (product_manufactured_brand !== undefined) {
    updateData.product_manufactured_brand = product_manufactured_brand;
  }

  if (product_HSN_code !== undefined) {
    updateData.product_HSN_code = product_HSN_code;
  }

  if (product_sale_price !== undefined) {
    updateData.product_sale_price = product_sale_price;
  }

  if (product_purchase_price !== undefined) {
    updateData.product_purchase_price = product_purchase_price;
  }

  if (product_reorder_Qty !== undefined) {
    updateData.product_reorder_Qty = product_reorder_Qty;
  }

  if (product_minimum_reorder_Qty !== undefined) {
    updateData.product_minimum_reorder_Qty = product_minimum_reorder_Qty;
  }

  if (product_cgst !== undefined) {
    updateData.product_cgst = product_cgst;
  }

  if (product_sgst !== undefined) {
    updateData.product_sgst = product_sgst;
  }

  if (product_igst !== undefined) {
    updateData.product_igst = product_igst;
  }

  if (serial_applicable !== undefined) {
    updateData.serial_applicable = serial_applicable;
  }

  if (gst_expt !== undefined) {
    updateData.gst_expt = gst_expt;
  }

  if (status !== undefined) {
    updateData.status = status;
  }

  // =========================
  // UPDATE PRODUCT
  // =========================

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedProduct,
      "Product updated successfully"
    )
  );
});

export const getAllProducts = asyncHandler(async (req, res) => {

  const data = await Product.find()
    .populate("group_name", "group_name")
    .populate("sub_group_name", "sub_group_name")
    .populate("product_type_name", "product_type_name")
    .populate("assembly_name", "assembly_name")
    .populate("sale_uom", "uom_name")
    .populate("purchase_uom", "uom_name")
    .select("-__v")
    .lean()
    .sort({ createdAt: -1 });

  // formatted response
  const formattedData = data.map(
    ({
      group_name,
      sub_group_name,
      product_type_name,
      assembly_name,
      sale_uom,
      purchase_uom,
      ...rest
    }) => ({
      ...rest,

      group_name: group_name?.group_name || "",

      sub_group_name:
        sub_group_name?.sub_group_name || "",

      product_type_name:
        product_type_name?.product_type_name || "",

      assembly_name:
        assembly_name?.assembly_name || "",

      sale_uom:
        sale_uom?.uom_name || "",

      purchase_uom:
        purchase_uom?.uom_name || "",
    })
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      formattedData,
      "Product list fetched successfully"
    )
  );
});

export const deleteProduct = asyncHandler(async (req, res) => {

  const { id } = req.params;

  // check product exists
  const findProduct = await Product.findById(id);

  if (!findProduct) {
    throw new ApiError(404, "Product not found");
  }

  // delete product
  await Product.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Product deleted successfully"
    )
  );
});

export const updateProductImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // =========================
  // CHECK PRODUCT EXISTS
  // =========================

  const findProduct = await Product.findById(id);

  if (!findProduct) {
    throw new ApiError(404, "Product not found");
  }

  // =========================
  // CHECK IMAGE EXISTS
  // =========================

  const productImageLocalPath = req.file?.path;

  if (!productImageLocalPath) {
    throw new ApiError(400, "Product image is required");
  }

  // =========================
  // UPLOAD CLOUDINARY
  // =========================

  const uploadImage = await uploadCloudinary(productImageLocalPath);

  if (!uploadImage) {
    throw new ApiError(500, "Image upload failed");
  }

  // =========================
  // UPDATE IMAGE
  // =========================

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      $set: {
        product_img: uploadImage.secure_url,
      },
    },
    {
      new: true,
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedProduct,
      "Product image updated successfully"
    )
  );
});

