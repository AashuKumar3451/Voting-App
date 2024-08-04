const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  CNIC: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(this.password, salt);
    this.password = hashPass;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePass = function (candidatePass) {
  try {
    const isMatch = bcrypt.compare(candidatePass, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};
userSchema.methods.compareName = function (candidateName) {
  console.log(candidateName);
  try {
    if (candidateName === this.name) {
      isMatch = true;
    } else {
      isMatch = false;
    }
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const user = mongoose.model("User", userSchema);
module.exports = user;
