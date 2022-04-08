const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getDrafts,
  createDraft,
  getDraftById,
  updateDraft,
  deleteDraft,
} = require("../controllers/draftController");

const router = express.Router();

router
  .route("/")
  .post(protect, createDraft)
  .put(protect, updateDraft)
  .get(protect, getDrafts);

router.route("/:id").get(protect, getDraftById).delete(protect, deleteDraft);

module.exports = router;
