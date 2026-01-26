import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../selectors/auth.selectors";
import axios from "axios";

const API_URL = "http://localhost:3001";

function PostCard({ post, authorName, onDeleted }) {
  const currentUser = useSelector(selectCurrentUser);

 
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

      <p>
        <strong>Likes:</strong> {post.likes ?? 0}
      </p>

      
      {currentUser?.id === String(post.authorId) && (
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
