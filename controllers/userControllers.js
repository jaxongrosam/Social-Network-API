const { User, Thought } = require("../models");

const userController = {
  // get all users
  async getAllUsers(req, res) {
    try {
      const dbUserData = await User.find()
        // dash indicates we don't need to return specific fields from query
        .select("-__V");

      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // get one user
  async getOneUser(req, res) {
    try {
      const dbUserData = await User.findOne({ _id: req.params.userId })
        .select("-__V")
        .populate("friends")
        .populate("thoughts");

      if (!dbUserData) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // creates a user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);

      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  //   updates a user
  async updateUser(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  //   deletes a user
  async deleteUser(req, res) {
    try {
      const dbUserData = await User.findOneAndDelete(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "User not found" });
      }
      //   bonus delete user's thoughts
      await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });

      res.json({ message: "User and Thoughts deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  //   adds a friend
  async addFriend(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  //   removes a friend
  async removeFriend(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports - userController;
