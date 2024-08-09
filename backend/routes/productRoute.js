const express = require("express");
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/products").get( getAllProducts );

router.route("/admin/products/new").post( isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route("/admin/products/:id")
.put(isAuthenticatedUser,  authorizeRoles("admin"), updateProduct)
.delete(isAuthenticatedUser,  authorizeRoles("admin"), deleteProduct)

router.route("/products/:id").get( getSingleProduct);

module.exports = router;