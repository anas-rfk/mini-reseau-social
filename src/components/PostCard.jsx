import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../selectors/auth.selectors";
import axios from "axios";
import { patchPost } from "../features/posts/thunks";

const API_URL = "http://localhost:3001";

function PostCard({ post, authorName = "Unknown", onDeleted, onUpdated, showActions }) {
  const currentUser = useSelector(selectCurrentUser);

  const isOwner = String(currentUser?.id) === String(post.authorId);

  const likedBy = post.likedBy || [];
  const userIdStr = String(currentUser?.id || "");
  const hasLiked = userIdStr ? likedBy.map(String).includes(userIdStr) : false;

  const handleDelete = async () => {
    if (!window.confirm("Supprimer ce post ?")) return;

    try {
      await axios.delete(`${API_URL}/posts/${post.id}`);
      if (onDeleted) onDeleted(post.id);
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Erreur suppression ❌");
    }
  };

  const handleLikeToggle = async () => {
    if (!userIdStr) return;

    const newLikedBy = hasLiked
      ? likedBy.filter((id) => String(id) !== userIdStr)
      : [...likedBy, userIdStr];

    try {
      const updated = await patchPost(post.id, { likedBy: newLikedBy });
      if (onUpdated) onUpdated(updated);
    } catch (err) {
      console.error("LIKE ERROR:", err);
      alert("Erreur like ❌");
    }
  };

  return (
    <div className="relative rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-300">
      
      {/* 🔝 Actions en haut à droite */}
      <div className="absolute top-4 right-4 flex gap-2">
        {showActions && (
          <Link
            to={`/post/${post.id}`}
            className="rounded-full bg-emerald-50 p-2 text-lg transition hover:bg-emerald-100 hover:scale-110"
            title="Détails"
          >
            🔍
          </Link>
        )}

        {isOwner && (
          <>
            <Link
              to={`/posts/edit/${post.id}`}
              className="rounded-full bg-emerald-50 p-2 text-lg transition hover:bg-emerald-100 hover:scale-110"
              title="Modifier"
            >
              ✏️
            </Link>

            <button
              onClick={handleDelete}
              className="rounded-full bg-red-50 p-2 text-lg transition hover:bg-red-100 hover:scale-110"
              title="Supprimer"
            >
              🗑️
            </button>
          </>
        )}
      </div>

      {/* 📝 Contenu */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-emerald-600">
          {authorName}
        </p>

        <p className="mt-2 text-slate-800 text-base leading-relaxed">
          {post.content}
        </p>

        {post.image && (
          <img
            src={post.image}
            alt="post"
            className="mt-4 w-full rounded-2xl border border-emerald-100"
          />
        )}

        {post.hashtags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.hashtags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ❤️ Footer Like en bas */}
      <div className="mt-4 border-t border-emerald-100 pt-4">
      <div className="flex items-center gap-3">
        
        <button
          onClick={handleLikeToggle}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-lg transition duration-200 ${
            hasLiked
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          } hover:scale-105 active:scale-95`}
        >
          👍
          <span className="text-sm font-semibold">
            {likedBy.length}
          </span>
        </button>

      </div>
    </div>
    </div>
  );
}

export default PostCard;