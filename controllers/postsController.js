const AppError = require("../utils/AppError");
const { parsePagination } = require("../utils/pagination");
const { validatePostBody, parsePositiveInt } = require("../utils/validation");
const postsService = require("../services/postsService");
const toggleLike = require("../services/postsService");

exports.createPost = async (req, res) => {
  const errors = validatePostBody(req.body);
  if (errors.length) {
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "요청한 값이 올바르지 않습니다.",
      errors
    );
  }

  const { title, content } = req.body;
  const userId = req.user.userId;

  const result = await postsService.createPost({ title, content, userId });
  return res.status(201).json(result);
};

exports.updatePost = async (req, res) => {
  const postId = parsePositiveInt(req.params.id);
  if (!postId) {
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "요청한 값이 올바르지 않습니다",
      ["id는 1 이상의 정수여야 합니다."]
    );
  }

  const loginUserId = req.user.userId;

  const allowedFields = ["title", "content"];
  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const keys = Object.keys(updates);
  if (keys.length === 0) {
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "요청한 값이 올바르지 않습니다.",
      ["수정할 값이 없습니다."]
    );
  }

  const errors = validatePostBody(updates, { partial: true });
  if (errors.length) {
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "요청한 값이 올바르지 않습니다.",
      errors
    );
  }

  const values = keys.map((k) => updates[k]);

  const result = await postsService.updatePost({
    postId,
    loginUserId,
    keys,
    values,
  });

  return res.json(result);
};

exports.deletePost = async (req, res) => {
  const postId = parsePositiveInt(req.params.id);
  if (!postId) {
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "요청한 값이 올바르지 않습니다.",
      ["id는 1 이상의 정수여야 합니다."]
    );
  }

  const loginUserId = req.user.userId;
  const result = await postsService.deletePost({ postId, loginUserId });
  return res.json(result);
};

exports.getPosts = async (req, res) => {
  const parsed = parsePagination(req.query, {
    defaultLimit: 10,
    maxLimit: 50,
    defaultOffset: 0,
  });

  if (!parsed.ok) {
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "요청한 값이 올바르지 않습니다.",
      [parsed.message]
    );
  }

  const searchRaw = req.query.search;
  const search =
    typeof searchRaw === "string" ? searchRaw.trim() : "";

  const sortRaw = req.query.sort;
  const order = sortRaw === "oldest" ? "ASC" : "DESC";

  const { limit, offset } = parsed;
  const result = await postsService.listPosts({
    limit,
    offset,
    search,
    order,
  });

  return res.json(result);
};

exports.getPostById = async (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (!id) {
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "요청한 값이 올바르지 않습니다.",
      ["id는 1이상의 정수여야 합니다."]
    );
  }

  const result = await postsService.getPostById(id);
  return res.json(result);
};

exports.toggleLike = async (req, res) => {
  const postId = parsePositiveInt(req.params.id);
  if (!postId) {
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "요청한 값이 올바르지 않습니다.",
      ["id는 1 이상의 정수여야 합니다."]
    );
  }

  const userId = req.user.userId;
  const result = await postsService.toggleLike(postId, userId);
  return res.json(result);
};
