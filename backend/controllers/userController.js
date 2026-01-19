const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

 const SignupUser = async (req, res)=>{
    try{
        const {name , email,password}= req.body;
        const exisitingUser = await User.findOne({email})
        if(exisitingUser){
            return res.status(400).json({message:"User already exists"})
        }
        const user = await User.create({
            name,
            email,
            password
        })
        res.status(201).json({
            success:true,
            message:"User created successfully",
            user:user
        })
    } catch(error){
        res.status(500).json({message:error.message})
    }
 }




const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ TOKEN GENERATE
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token, // 🔥 VERY IMPORTANT
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* GET MY PROFILE */
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE PROFILE */
const updateProfile = async (req, res) => {
  try {
    const { bio, location, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user,
      { bio, location, profileImage },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ADD SKILL */
const addSkill = async (req, res) => {
  try {
    const { name, type } = req.body; // offered | learn

    if (!["offered", "learn"].includes(type)) {
      return res.status(400).json({ message: "Invalid skill type" });
    }

    const field = type === "offered" ? "skillsOffered" : "skillsToLearn";

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent duplicate skill
    if (user[field].some((s) => s.name === name)) {
      return res.status(400).json({ message: "Skill already exists" });
    }

    user[field].push({ name });
    await user.save();

    res.json(user[field]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* REMOVE SKILL */
const removeSkill = async (req, res) => {
  try {
    const { skillName, type } = req.params;

    if (!["offered", "learn"].includes(type)) {
      return res.status(400).json({ message: "Invalid skill type" });
    }

    const field = type === "offered" ? "skillsOffered" : "skillsToLearn";

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user[field] = user[field].filter((s) => s.name !== skillName);
    await user.save();

    res.json(user[field]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  addSkill,
  removeSkill,
  loginUser,
  SignupUser
};
