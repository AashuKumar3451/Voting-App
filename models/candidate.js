const mongoose = require("mongoose");

const candidateSchema = mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    party: {
        type: String,
        required: true,
        unique: true
    }, 
    age: {
        type: Number,
        required: true
    },
    votes:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User"
            },
            votedAt:{
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount:{
        type: Number,
        default: 0
    }

});
const candidate = mongoose.model("Candidate", candidateSchema);
module.exports = candidate;