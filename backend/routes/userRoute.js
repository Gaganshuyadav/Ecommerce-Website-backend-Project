const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");

router.route("/register").post( registerUser);

router.route("/login").post( loginUser);

router.route("/logout").get( logoutUser);

router.route("/password/forgot").post( forgotPassword);
 
router.route("/password/reset/:resetToken").post( resetPassword);

router.route("/me").get( isAuthenticatedUser, getUserDetails);

module.exports = router;


