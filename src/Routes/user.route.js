const userRouter = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//UPDATE
userRouter.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json({message: `${req.body.username} details updated successfully...`,updatedUser});
    } catch (err) {
      res.status(500).json({
        err,
        message: "User not exist!"
      });
    }
  } else {
    res.status(401).json("You can update only your account!");
  }
});


//delete
userRouter.delete('/:id', async function (req, res) {
  const userId = req.params.id;
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "user Profile does not exist!"
      });
    }
    
    await user.deleteOne();
    res.status(200).json({
      message: "user Profile has been deleted successfully..."
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Network error !",
      err
    });
  }
});


//GET USER
userRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/", async (req, res) => {
  try {
    const user = await User.find();
    
    if (!user) {
      return res.status(404).json({ message: "Users data not found" });
    }
    return res.status(200).json(user);
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = userRouter;
