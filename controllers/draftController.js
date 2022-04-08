const asyncHandler = require("express-async-handler");
const Draft = require("../models/Draft");

// @desc    Get paginated drafts
// @route   GET /api/drafts
// @access  Private
const getDrafts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  //sort criteria
  const count = await Draft.countDocuments({});
  const drafts = await Draft.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ drafts, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get a specific draft by id
// @route   GET /api/drafts/:id
// @access  Private
const getDraftById = asyncHandler(async (req, res) => {
  const draft = await Draft.findById(req.params.id);
  if (draft) {
    res.send(draft);
  } else {
    res.setStatus(404);
    throw new Error("Draft not found.");
  }
});

// @desc    Create a new draft
// @route   Draft /api/drafts
// @access  Private
const createDraft = asyncHandler(async (req, res) => {
  const { title, image, tags, text, postId } = req.body;
  //Check if the draft has the same title or image (not including the default) as an existing Draft
  const DraftTitleExists = await Draft.findOne({ title });

  if (DraftTitleExists)
    return res
      .status(400)
      .json({ message: "Have a Draft with that title already!" });

  const draft = new Draft({
    title,
    text,
    tags,
    image,
    postId,
  });
  try {
    const savedDraft = await draft.save();
    res.send(savedDraft);
  } catch (error) {
    res.status(400).send(error);
  }
});

// @desc    Update a draft
// @route   PUT /api/drafts
// @access  Private
const updateDraft = asyncHandler(async (req, res) => {
  const draft = await Draft.findById(req.body.id);

  if (draft) {
    draft.title = req.body.title || draft.title;
    draft.text = req.body.text || draft.text;
    draft.tags = req.body.tags || draft.tags;
    draft.image = req.body.image || draft.image;

    const updatedDraft = await draft.save();

    res.json({
      _id: updatedDraft._id,
      title: updatedDraft.title,
      text: updatedDraft.text,
      tags: updatedDraft.tags,
      image: updatedDraft.image,
    });
  } else {
    res.status(404);
    throw new Error("The draft you want to edit doesn't exist.");
  }
});

// @desc    Remove a draft
// @route   DELETE /api/drafts/:id
// @access  Private
const deleteDraft = asyncHandler(async (req, res) => {
  await Draft.findByIdAndDelete(req.params.id, (error) => {
    if (error) {
      console.error(error);
      return res.status(400).send("Error deleting the draft.");
    } else {
      res.send("Successfully deleted.");
    }
  });
});

module.exports = {
  getDrafts,
  createDraft,
  getDraftById,
  updateDraft,
  deleteDraft,
};
