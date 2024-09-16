const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, udpateUserRole, deleteUser } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");

router.route("/register").post( registerUser);

router.route("/login").post( loginUser);

router.route("/logout").get( logoutUser);

router.route("/password/forgot").post( forgotPassword);
 
router.route("/password/reset/:resetToken").post( resetPassword);

router.route("/me").get( isAuthenticatedUser, getUserDetails);

router.route("/password/update").put( isAuthenticatedUser, updatePassword);

router.route("/me/update").put( isAuthenticatedUser, updateProfile);
//--admin
router.route("/admin/users").get( isAuthenticatedUser , authorizeRoles("admin"), getAllUsers);

router.route("/admin/user/:id")
    .get( isAuthenticatedUser, authorizeRoles("admin") ,getSingleUser)
    .put( isAuthenticatedUser, authorizeRoles("admin"), udpateUserRole)
    .delete( isAuthenticatedUser, authorizeRoles("admin"), deleteUser)



module.exports = router;


