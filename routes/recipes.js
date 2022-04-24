const express = require("express");
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  uploadRecipePhoto,
  deleteRecipe,
} = require("../controllers/recipes");

const Recipe = require("../models/Recipe");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");

router.route("/").get(advancedResults(Recipe), getRecipes).post(createRecipe);

router.route("/:id").get(getRecipe).put(updateRecipe).delete(deleteRecipe);

router.route("/:id/photo").put(uploadRecipePhoto);

module.exports = router;
