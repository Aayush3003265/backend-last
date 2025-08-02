// import Sentiment from "sentiment";
import Comment from "../models/Comment.js";
import { positiveWords, negativeWords } from "../utils/sentimentWords.js";

// const sentiment = new Sentiment();

function analyzeSentiment(text) {
  const words = text.toLowerCase().split(/\W+/);
  let score = 0;

  words.forEach((word) => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });

  return score;
}
// ✅ Add new comment with sentiment analysis
// export const addComment = async (req, res) => {
//   try {
//     const { productId, userId, text } = req.body;

//     // Validation check
//     if (!productId || !userId || !text) {
//       return res.status(400).json({ message: "Missing required fields." });
//     }

//     // Log for debugging
//     console.log("📥 New Comment Data:", { productId, userId, text });

//     // Analyze sentiment score
//     const result = sentiment.analyze(text);
//     const sentimentScore = result.score;

//     // Save comment to DB
//     const comment = await Comment.create({
//       productId,
//       userId,
//       text,
//       sentimentScore,
//     });

//     res.status(201).json(comment);
//   } catch (error) {
//     console.error("❌ Error in addComment:", error.message);
//     res
//       .status(500)
//       .json({ message: "Failed to add comment", error: error.message });
//   }
// };
export const addComment = async (req, res) => {
  try {
    const { productId, userId, text } = req.body;

    if (!productId || !userId || !text) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const sentimentScore = analyzeSentiment(text);

    const comment = await Comment.create({
      productId,
      userId,
      text,
      sentimentScore,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("❌ Error in addComment:", error.message);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// ✅ Get comments for a product, sorted by sentiment score

export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId)
      return res.status(400).json({ message: "Product ID required" });

    const comments = await Comment.find({ productId })
      .populate("userId", "name") // Populate only the name field
      .sort({ sentimentScore: -1, createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};
// controllers/CommentController.js

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: you can check if comment exists before deleting
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Optional: check if user is authorized to delete this comment
    // For now, just delete (add auth check as needed)

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
