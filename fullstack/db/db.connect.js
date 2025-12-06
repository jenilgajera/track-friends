const mongoose = require("mongoose");

const Dbconnect = async () => {
  try {
    const db = await mongoose.connect("mongodb://localhost:27017/user");
    if (db) {
      console.log("connected db");
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


module.exports=Dbconnect();