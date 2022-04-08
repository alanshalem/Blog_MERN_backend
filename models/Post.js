const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
