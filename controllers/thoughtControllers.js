const { User, Thought } = require("../models");

const thoughtController = {
  // get all thoughts
  async getAllThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find()
        // dash indicates we don't need to return specific fields from query
        .select("-__V");

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  //   get one thought
  async getOneThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__V");

      if (!dbThoughtData) {
        return res.status(404).json({ message: "Thought not found" });
      }

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const { thoughtText, username } = req.body;
      const dbThoughtData = await Thought.create({ thoughtText, username });
      const thoughtId = dbThoughtData._id;

      const updatedUser = await Thought.findOneandUpdate(
        { username },
        { $push: { thoughts: thoughtId } },
        { new: true }
      );

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  //   update a thought
  async updateThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: "Thought not found" });
      }

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  //   delete a thought
  async deleteThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndDelete(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: "Thought not found" });
      }

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  //   create new reaction
  async newReaction(req, res) {
    try {
      const { reactionBody, username } = req.body;
      const thoughtId = req.params.thoughtId;
      const newReaction = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        {
          $push: {
            reactions: {
              reactionBody,
              username,
            },
          },
        },
        { new: true }
      );

      res.json(newReaction);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
  //   delete a reaction
  async deleteReaction(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      const reactionId = req.params.reactionId;

      const thoughtWithDeletedReaction = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        {
          $pull: { reactions: { reactionId } },
        },
        { new: true }
      );

      res.json(thoughtWithDeletedReaction);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
