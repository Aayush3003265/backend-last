import express from "express";
import {
  addComment,
  getCommentsByProduct,
} from "../controllers/CommentController.js";

const router = express.Router();

router.post("/", addComment);
router.get("/:productId", getCommentsByProduct);

export default router;
