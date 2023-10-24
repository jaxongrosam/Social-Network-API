const router = require("express").Router();

const {
  getAllThoughts,
  getOneThought,
  createThought,
  updateThought,
  deleteThought,
  newReaction,
  deleteReaction,
} = require("../../controllers/thoughtControllers.js");

// api/thoughts
router.route("/").get(getAllThoughts);

// api/thoughts/:thoughtId
router
  .route("/:thoughtId")
  .get(getOneThought)
  .post(createThought)
  .put(updateThought)
  .delete(deleteThought);

//   api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions").post(newReaction).delete(deleteReaction);

module.exports = router;
