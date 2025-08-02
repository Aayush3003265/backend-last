import Sentiment from "sentiment";
import Comment from "../models/Comment.js";

const sentiment = new Sentiment();

// ✅ Add new comment with sentiment analysis
export const addComment = async (req, res) => {
  try {
    const { productId, userId, text } = req.body;

    // Validation check
    if (!productId || !userId || !text) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Log for debugging
    console.log("📥 New Comment Data:", { productId, userId, text });

    // Analyze sentiment score
    const result = sentiment.analyze(text);
    const sentimentScore = result.score;

    // Save comment to DB
    const comment = await Comment.create({
      productId,
      userId,
      text,
      sentimentScore,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("❌ Error in addComment:", error.message);
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
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
