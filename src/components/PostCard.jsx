import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../selectors/auth.selectors";
import axios from "axios";
import { patchPost } from "../features/posts/thunks";

const API_URL = "http://localhost:3001";

function PostCard({ post, authorName = "Unknown", onDeleted, onUpdated, showActions }) {
  const currentUser = useSelector(selectCurrentUser);

  const isOwner = String(currentUser?.id) === String(post.authorId);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) return;

    try {
      await axios.delete(`${API_URL}/posts/${post.id}`);
      alert("Post supprimé ✅");
      if (onDeleted) onDeleted(post.id);
    } catch (err) {
      console.error("DELETE POST ERROR:", err);
      alert("Erreur lors de la suppression du post ❌");
    }
  };

  // ✅ Likes basés sur likedBy
  const likedBy = post.likedBy || [];
  const userIdStr = String(currentUser?.id || "");
  const hasLiked = userIdStr ? likedBy.map(String).includes(userIdStr) : false;

  const handleLikeToggle = async () => {
    if (!userIdStr) return;

    const newLikedBy = hasLiked
      ? likedBy.filter((id) => String(id) !== userIdStr)
      : [...likedBy, userIdStr];

    try {
      const updated = await patchPost(post.id, { likedBy: newLikedBy });
      if (onUpdated) onUpdated(updated);
    } catch (err) {
      console.error("LIKE TOGGLE ERROR:", err);
      alert("Erreur like ❌");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        maxWidth: 600,
      }}
    >
      <p>
        <strong>Auteur:</strong> {authorName}
      </p>

      <p>
        <strong>Contenu:</strong> {post.content}
      </p>

      {post.image && (
        <img
          src={post.image}
          alt="post"
          style={{ width: "100%", maxWidth: 600, borderRadius: 8 }}
        />
      )}

      <p>
        <strong>Hashtags:</strong> {(post.hashtags || []).join(" , ")}
      </p>

      {/* ✅ Affichage correct du nombre de likes */}
      <p>
        <strong>Likes:</strong> {likedBy.length}
      </p>

      <button
        onClick={handleLikeToggle}
        style={{
          padding: "6px 12px",
          backgroundColor: hasLiked ? "#6c757d" : "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
          marginTop: 8,
          marginRight: 8,
        }}
      >
        {hasLiked ? "Unlike" : "Like"}
      </button>
      {showActions && (
      <Link
          to={`/post/${post.id}`}
          style={{
            marginRight: 8,
            padding: "6px 12px",
            backgroundColor: "#17a2b8",
            color: "#fff",
            borderRadius: 5,
            textDecoration: "none",
            display: "inline-block",
            marginTop: 8,
          }}
        >
          Détails
        </Link>
      )}
      {isOwner && (
        <div style={{ marginTop: 8 }}>
          <Link
            to={`/posts/edit/${post.id}`}
            style={{
              marginRight: 8,
              padding: "6px 12px",
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: 5,
              textDecoration: "none",
            }}
          >
            Edit
          </Link>

          <button
            onClick={handleDelete}
            style={{
              padding: "6px 12px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
          

        </div>
      )}
    </div>
  );
}

export default PostCard;
