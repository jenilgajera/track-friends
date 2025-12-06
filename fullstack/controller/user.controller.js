const userModel = require("../models/user.model");

const userController = {
  userAdd: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(401).json({
          scucess: false,
          message: "name is required",
        });
      }
      const usecreate = await userModel.create({name});
      if (usecreate) {
        return res.status(200).json({
          scucess: true,
          message: "usercreated succesfully",
        });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports=userController
