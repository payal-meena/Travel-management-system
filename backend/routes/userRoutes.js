const express = require("express");
const router = express.Router();
// const protect = require("../middleware/auth.middleware.js");

const {
  getMyProfile,
  updateProfile,
  addSkill,
  removeSkill,
  loginUser,
  SignupUser,
} = require("../controllers/userController.js");

router.get("/me",  getMyProfile);
router.put("/me",  updateProfile);

router.post("/login",loginUser);
router.post("/singup",SignupUser)

router.post("/skill", addSkill);
router.delete("/skill/:type/:skillName", removeSkill);

module.exports = router;
