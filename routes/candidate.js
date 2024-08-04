const express = require("express");
const router = express.Router();
const user = require("../models/user");
const candidate = require("../models/candidate");
const { jwtAuthMiddleware, generateJWT } = require("../jwt");

const checkAdminRole = async (userID) => {
  try {
    const person = await user.findById(userID);
    return person.role === "admin";
  } catch (error) {
    return false;
  }
};

// For Admin
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.userPayload.id))) {
      return res.status(403).json({ message: "User has no access." });
    }
    const data = req.body;
    const newCandidate = new candidate(data);
    const response = await newCandidate.save();
    console.log("New Candidate is saved to database");
    return res.status(200).json({ candidate: response });
  } catch (err) {
    console.log("Error Occured", err);
    res.status(404).send("Error Occured", err);
  }
});

router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.userPayload.id))) {
      return res.status(403).json({ message: "User has no access." });
    }
    const candidateId = req.params.candidateId;
    const updatedCandidate = req.body;
    const response = await candidate.findByIdAndUpdate(
      candidateId,
      updatedCandidate,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!response) {
      res.status(404).send("Candidate Not Found");
    }
    console.log("Data updated");
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send("Error occured");
  }
});

router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.userPayload.id))) {
      return res.status(403).json({ message: "User has no access." });
    }
    const candidateId = req.params.candidateId;
    const response = await candidate.findByIdAndDelete(candidateId);
    if (!response) {
      res.status(404).send("Candidate Not Found");
    }
    console.log("Data deleted");
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send("Error occured");
  }
});

router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const userID = req.userPayload.id;
    
    const candid = await candidate.findById(candidateId);
    if(!candid){return res.status(404).json({message:"Candidate not found"});}
    const person = await user.findById(userID);
    if(!person){return res.status(404).json({message:"User not found"});}
    if(person.isVoted){return res.status(400).json({message:"You have already voted."});}
    if(person.role==="admin"){return res.status(403).json({message:"Admin is not allowed to vote."});}
    
    candid.votes.push({user:userID});
    candid.voteCount++;
    await candid.save();

    person.isVoted = true;
    await person.save();

    res.status(200).json({message:"Vote recorded successfuly"});
    

  } catch (error) {
    res.status(500).send("Error occured");
  }
});

router.get("/vote/count", async(req,res)=>{
  const candidates = await candidate.find().sort({voteCount:"desc"});
  const voteRecords = candidates.map((data)=>{
    return{
      party:data.party,
      count:data.voteCount
    }
  });
  res.status(200).json(voteRecords);

});

router.get("/", async(req,res)=>{
  const candidates = await candidate.find().sort({party:"asc"});
  const records = candidates.map((data)=>{
    return{
      party:data.party,
      candidate:data.name
    }
  });
  res.status(200).json(records);

});

module.exports = router;
