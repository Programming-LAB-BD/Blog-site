const { validationResult } = require("express-validator");
const Flash = require("../utils/Flash");
const errorFormatter = require("../utils/validationErrorFormatter");
const readingTime = require("reading-time");
const Post = require("../models/Post");
const Profile = require("../models/Profile");

exports.createPostGetController = (req, res, next) => {
  res.render("pages/dashboard/posts/create-post", {
    title: "Create a new Post",
    error: {},
    flashMassege: Flash.getMassege(req),
    value: {},
  });
};

exports.createPostPostController = async (req, res, next) => {
  let { title, body, tags } = req.body;
  let errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    res.render("pages/dashboard/posts/create-post", {
      title: "Create A New Post",
      error: errors.mapped(),
      flashMassege: Flash.getMassege(req),
      value: {
        title,
        body,
        tags,
      },
    });
  }

  tags = tags.split(", ");

  let readTime = readingTime(body).text;

  let post = new Post({
    title,
    body,
    author: req.user._id,
    tags,
    thumbnail: "",
    readTime,
    like: [],
    dislike: [],
    comment: [],
  });

  if (req.file) {
    post.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    let created_post = await post.save();
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $push: { posts: created_post._id } }
    );
    req.flash("success", "Post Created Successfully.");
    return res.redirect(`/posts/edit/${created_post._id}`);
  } catch (e) {
    next(e);
  }
};

exports.editPostGetController = async (req, res, next) => {
  let postId = req.params.postId;

  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });

    if (!post) {
      let error = new Error("404 Not found.");
      error.status = 404;
      throw error;
    }

    res.render("pages/dashboard/posts/edit-post", {
      title: "Edit Your Existing Post",
      error: {},
      flashMassege: Flash.getMassege(req),
      post,
    });
  } catch (e) {
    next(e);
  }
};

exports.editPostPostController = async (req, res, next) => {
  let postId = req.params.postId;
  let { title, body, tags } = req.body;
  let errors = validationResult(req).formatWith(errorFormatter);

  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });

    if (!post) {
      let error = new Error("404 Not found.");
      error.status = 404;
      throw error;
    }

    if (!errors.isEmpty()) {
      res.render("pages/dashboard/posts/create-post", {
        title: "Edit Your Existing Post",
        error: errors.mapped(),
        flashMassege: Flash.getMassege(req),
        post,
      });
    }

    tags = tags.split(", ");

    let thumbnail = post.thumbnail;
    if (req.file) {
      thumbnail = `/uploads/${req.file.filename}`;
    }

    await Post.findOneAndUpdate(
      { _id: post._id },
      { $set: { title, body, tags, thumbnail } },
      { new: true }
    );

    req.flash("success", "Post Updated Successfully.");
    res.redirect("/posts/edit/" + post._id);
  } catch (e) {
    next(e);
  }
};

exports.deletePostGetController = async (req, res, next) => {
  let { postId } = req.params;

  try {
    let post = await Post.findOne({ author: req.user._id, _id: postId });

    if (!post) {
      let error = new Error("404 Not Found.");
      error.status = 404;
      throw error;
      return;
    }

    await Post.findOneAndDelete({ _id: postId });
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { posts: postId } }
    );

    req.flash("success", "Post deleted successfully.");
    res.redirect("/posts");
  } catch (e) {
    next(e);
  }
};

exports.allPostGetController = async (req, res, next) => {
  try {
    let posts = await Post.find({ author: req.user._id });

    res.render("pages/dashboard/posts/posts", {
      title: "My All Posts",
      flashMassege: Flash.getMassege(req),
      posts,
    });
  } catch (e) {
    next(e);
  }
};
