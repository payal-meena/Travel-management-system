const express = require("express");
const router = express.Router();
 const protect = require("../middleware/authMiddleware.js");

const {
  getMyProfile,
  updateProfile,
  addSkill,
  removeSkill,
  loginUser,
  SignupUser,
} = require("../controllers/userController.js");
router.post("/login",loginUser);
router.post("/singup",SignupUser)

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateProfile);
router.post("/skill", protect, addSkill);
router.delete("/skill/:type/:skillName", protect, removeSkill);


module.exports = router;
