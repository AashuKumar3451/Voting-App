const express = require("express");
const router = express.Router();
const user = require("../models/user");
const { jwtAuthMiddleware, generateJWT } = require("../jwt");

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new user(data);
    if(newUser.role === "admin"){
      const admin = await user.findOne({role:"admin"});
      if(admin){
        return res.status(401).json({message:"Admin already present in the system."});}
    }
    const response = await newUser.save();
    if(!response){
      console.log("error occured saving object");
    }
    console.log("New User is saved to database");

    const payload = {
      id: response.id,
    };
    const token = generateJWT(payload);
    console.log(token);
    return res.status(200).json({ user: response, token: token });
  } catch (err) {
    console.log("Error Occured", err);
    res.status(401).json({err:err});
  }
});

router.post("/login", async (req, res) => {
  try {
    const { CNIC, password } = req.body;
    const person = await user.findOne({ CNIC: CNIC });
    if (!person || !(await person.comparePass(password))) {
      console.log("Username or password is wrong.");
      return res.status(401).json("Username or password is wrong.");
    }
    const payload = {
      id: person.id,
    };
    const token = generateJWT(payload);
    res.json({ user: person, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error", error);
  }
});

router.get("/profile",jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.userPayload;
        console.log(userData);
        const person = await user.findById(userData.id);
        console.log(person);
        res.status(200).json({person});
      } catch (error) {
        res.status(500).send("Error occured");
      }
});

router.put("/profile/password",jwtAuthMiddleware, async(req,res)=>{
    try {
        const userId = req.userPayload.id;
        const {currentPassword, newPassword} = req.body;
        const person = await user.findById(userId);
        console.log(person);
        if(!(await person.comparePass(currentPassword))){return res.status(401).json({message: "Invalid Password"});}
        person.password = newPassword;
        await person.save();
        console.log("Password Updated");
        res.status(200).json({message: "Password Updated."});
    } catch (error) {
        res.status(500).send("Error occured");
    }
});

router.put("/profile/username",jwtAuthMiddleware, async(req,res)=>{
    try {
        const userId = req.userPayload.id;
        const {currentUsername, newUsername} = req.body;
        const person = await user.findById(userId);
        // console.log(person);
        if(!(await person.compareName(currentUsername))){return res.status(401).json({message:"Invalid Username"});}
        person.name = newUsername;
        await person.save();
        console.log("Username Updated");
        res.status(200).json({message: "Username Updated."});
    } catch (error) {
        res.status(500).send("Error occured");
    }
});


module.exports = router;