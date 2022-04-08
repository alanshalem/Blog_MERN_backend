const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");

// @desc    Get paginated posts
// @route   GET /api/posts/admin
// @access  Private
const getAllPosts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const filter = req.query.filter;
  let posts = [];

  //sort criteria

  const count = await Post.countDocuments({});

  if (filter) {
    if (filter === "title") {
      posts = await Post.find({})
        .sort({ title: 1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    } else if (filter === "tags") {
      posts = await Post.find({})
        .sort({ tags: 1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    } else if (filter === "date") {
      posts = await Post.find({})
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    }
  } else {
    posts = await Post.find({})
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  }

  res.json({ posts, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get a limited amount of posts with cursor pagination
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  let limit = 8;
  let posts = [];
  let filter = {};

  if (req.query.filter_category) {
    filter = { tags: req.query.filter_category };
  }

  if (req.query.next_cursor) {
    posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .find({ createdAt: { $lt: req.query.next_cursor } })
      .limit(limit);
  } else {
    //First page
    posts = await Post.find(filter).sort({ createdAt: -1 }).limit(limit);
  }

  const nextPost = await Post.find(filter)
    .sort({ createdAt: -1 })
    .find({ createdAt: { $lt: posts[posts.length - 1].createdAt } })
    .limit(1);

  if (posts.length < limit || nextPost.length === 0) {
    return res.json({ posts });
  } else {
    let next_cursor = posts[posts.length - 1].createdAt;
    return res.json({ posts, next_cursor });
  }
});

// @desc    Get a specific post by id
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    res.send(post);
  } else {
    res.setStatus(404);
    throw new Error("Post not found.");
  }
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, image, tags, text } = req.body;
  //Check if an existing post has the same title or image (not including the default)
  const postTitleExists = await Post.findOne({ title });
  if (postTitleExists)
    return res
      .status(400)
      .json({ message: "Have a post with that title already!" });

  const post = new Post({
    title,
    text,
    tags,
    image,
  });
  try {
    const savedPost = await post.save();
    res.send(savedPost);
  } catch (error) {
    res.status(400).send(error);
  }
});

// @desc    Update a post
// @route   PUT /api/posts
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.body.id);

  if (post) {
    post.title = req.body.title || post.title;
    post.text = req.body.text || post.text;
    post.tags = req.body.tags || post.tags;
    post.image = req.body.image || post.image;

    const updatedPost = await post.save();

    res.json({
      _id: updatedPost._id,
      title: updatedPost.title,
      text: updatedPost.text,
      tags: updatedPost.tags,
      image: updatedPost.image,
    });
  } else {
    res.status(404);
    throw new Error("The post you want to edit doesn't exist.");
  }
});

// @desc    Remove a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    await post.remove();
    res.json({ message: "Post removed" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc    Get all posts
// @route   GET /api/posts/admin
// @access  Private
const getOldPosts = asyncHandler(async (req, res) => {
  const limit = 4;
  await Post.countDocuments().exec((error, count) => {
    if (error) {
      res.status(400).send("Error counting documents.");
    } else {
      let random = Math.floor((Math.random() * count) / 2);
      Post.find({})
        .skip(random)
        .limit(limit)
        .exec((error, result) => {
          if (error) {
            res.status(400).send("Error getting old posts.");
          } else {
            res.json(result);
          }
        });
    }
  });
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getAllPosts,
  getOldPosts,
};
