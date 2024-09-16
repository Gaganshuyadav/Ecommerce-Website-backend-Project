const express = require("express");
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct, createProductReview, getProductReviews, deleteReview, getAdminProducts } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

//user
router.route("/products").get( getAllProducts );

router.route("/products/:id").get( getSingleProduct);

router.route("/review").put( isAuthenticatedUser, createProductReview);

//use req.query 
router.route("/reviews").get( getProductReviews).delete( isAuthenticatedUser, deleteReview);

//admin
router.route("/admin/products/new").post( isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route("/admin/products").get( isAuthenticatedUser, authorizeRoles("admin") ,getAdminProducts);

router.route("/admin/products/:id")
.put(isAuthenticatedUser,  authorizeRoles("admin"), updateProduct)
.delete(isAuthenticatedUser,  authorizeRoles("admin"), deleteProduct);

module.exports = router;

