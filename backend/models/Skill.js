const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    type: {
      type: String,
      enum: ["Offer", "Learn"],
      required: true,
    },

    description: {
      type: String,
    },

    experience: {
      type: Number, // years
    },

    category: {
      type: String,
    },

    exchangeSkills: {
      type: String,
    },

    icon: {
      type: String,
      default: "school", // material icon name
    },

    status: {
      type: String,
      enum: ["Active", "Paused", "Learning"],
      default: "Active",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
