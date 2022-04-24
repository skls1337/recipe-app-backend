const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Recipe = require("../models/Recipe");
const path = require("path");

// @desc      Get all recipes
// @route     GET /recipes
exports.getRecipes = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single recipe
// @route     GET /recipes/:id
exports.getRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: recipe,
  });
});

// @desc      Create recipe
// @route     POST /recipes
exports.createRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.create(req.body);

  res.status(201).json({
    success: true,
    data: recipe,
  });
});

// @desc      Update recipe
// @route     PATCH /recipes/:id
exports.updateRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: recipe,
  });
});

// @desc      Update recipe photo
// @route     PUT /recipes/:id/photo
exports.uploadRecipePhoto = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(
      new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${recipe._id}_${file.name}_${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Recipe.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

// @desc      Delete recipe
// @route     DELETE /recipes/:id
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(
      new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404)
    );
  }

  await Recipe.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
