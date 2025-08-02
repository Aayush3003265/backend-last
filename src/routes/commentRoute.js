import express from "express";
import {
  addComment,
  getCommentsByProduct,
  deleteComment, // import delete controller
} from "../controllers/CommentController.js";

const router = express.Router();

router.post("/", addComment);
router.get("/:productId", getCommentsByProduct);
router.delete("/:id", deleteComment); // add this route

export default router;
