import React, { useState } from "react";
import { commentsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

const CommentList = ({
  taskId,
  comments,
  loading,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await commentsAPI.createComment({
        content: newComment,
        task: taskId,
      });

      onCommentAdded(response.data);
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await commentsAPI.deleteComment(commentId);
        onCommentDeleted(commentId);
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Failed to delete comment");
      }
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="comments-section">
      <h4 className="comments-header">Comments ({comments.length})</h4>

      <form className="comment-form" onSubmit={handleSubmitComment}>
        <div className="form-group">
          <textarea
            className="form-input form-textarea"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            maxLength={500}
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-small"
          disabled={submitting || !newComment.trim()}
        >
          {submitting ? "Adding..." : "Add Comment"}
        </button>
      </form>

      {loading ? (
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <div
            className="spinner"
            style={{ width: "20px", height: "20px" }}
          ></div>
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <div className="comment-avatar">
                {getInitials(comment.author.name)}
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{comment.author.name}</span>
                  <span className="comment-date">
                    {format(new Date(comment.createdAt), "MMM dd, yyyy HH:mm")}
                  </span>
                  {user._id === comment.author._id && (
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDeleteComment(comment._id)}
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.2rem 0.5rem",
                        marginLeft: "auto",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="comment-text">{comment.content}</div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentList;
