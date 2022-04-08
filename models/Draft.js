const mongoose = require("mongoose");

const draftSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    image: {
      type: String,
      default: "/images/default.jfif",
    },
    postId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Draft", draftSchema);
