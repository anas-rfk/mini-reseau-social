import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../selectors/auth.selectors";

function PostCard({ post, authorName }) {
  const currentUser = useSelector(selectCurrentUser);

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

      {/* Edit button only for post author */}
      {currentUser?.id === String(post.authorId) && (
        <Link
          to={`/posts/edit/${post.id}`}
          style={{
            display: "inline-block",
            marginTop: 8,
            padding: "6px 12px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: 5,
            textDecoration: "none",
          }}
        >
          Edit
        </Link>
      )}
    </div>
  );
}

export default PostCard;
