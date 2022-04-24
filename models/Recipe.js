const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  ingredients: [
    {
      type: String,
      required: [true, "Please add a ingredients"],
    },
  ],
  preprationSteps: [
    {
      type: String,
      required: [true, "Please add the preparation steps"],
    },
  ],
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
