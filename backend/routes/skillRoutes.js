const express = require("express");
const router = express.Router();

const {
  addSkill,
  getMySkills,
  deleteSkill,
  updateSkill
} = require("../controllers/skillController");

const protect = require("../middleware/authMiddleware");

// 🔐 PROTECTED ROUTES
router.post("/", protect, addSkill);
router.get("/my", protect, getMySkills);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);

module.exports = router;
