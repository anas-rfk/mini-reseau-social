import { useEffect,  useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPosts } from "../features/posts/thunks";
import { fetchUsers } from "../features/users/thunks";
import axios from "axios";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../selectors/auth.selectors";
import { selectPostByIdLocal } from "../selectors/postDetail.selector";

import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

const API_URL = "http://localhost:3001";

function PostDetail() {
  const { id } = useParams();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);

  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState("");

  const currentUser = useSelector(selectCurrentUser);
  const [newComment, setNewComment] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setError("");
        setLoadingPost(true);

        const [postsData, usersData] = await Promise.all([
          fetchPosts(),
          fetchUsers(),
        ]);

        setPosts(postsData);
        setUsers(usersData);
      } catch (e) {
        console.error("FETCH POST/USERS ERROR:", e);
        setError("Erreur lors du chargement du post.");
      } finally {
        setLoadingPost(false);
      }
    };

    run();
  }, [id]);

  useEffect(() => {
    setLoadingComments(true);
    axios
      .get(`${API_URL}/comments?postId=${id}`)
      .then((res) => setComments(res.data))
      .catch((err) => {
        console.error("FETCH COMMENTS ERROR:", err);
        setError("Erreur lors du chargement des commentaires.");
      })
      .finally(() => setLoadingComments(false));
  }, [id]);

  const post = selectPostByIdLocal(posts, id);

  const getUserName = (userId) => {
    const u = users.find((x) => String(x.id) === String(userId));
    return u ? u.username : "Unknown";
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!currentUser?.id) {
      setError("Vous devez être connecté pour commenter.");
      return;
    }

    try {
      setIsSending(true);
      setError("");

      const res = await axios.post(`${API_URL}/comments`, {
        postId: Number(id),
        authorId: currentUser.id,
        content: newComment.trim(),
      });

      setComments((prev) => [res.data, ...prev]); // dernier en bas
      setNewComment("");
    } catch (err) {
      console.error("ADD COMMENT ERROR:", err);
      setError("Erreur lors de l'ajout du commentaire.");
    } finally {
      setIsSending(false);
    }
  };

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Loader />
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <EmptyState
              title="Post introuvable"
              description="Ce post n'existe pas ou a été supprimé."
              actionLabel="Retour Home"
              actionTo="/"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            🔎 Détails du post
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Lis le post, like, puis ajoute un commentaire 💬
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Post */}
        <PostCard
          post={post}
          authorName={getUserName(post.authorId)}
          showActions={false}
          onUpdated={(updatedPost) => {
            setPosts((prev) =>
              prev.map((p) =>
                String(p.id) === String(updatedPost.id) ? updatedPost : p
              )
            );
          }}
        />

        {/* Add Comment */}
        <div className="mt-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">
              💬 Ajouter un commentaire
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {currentUser?.username || "Invité"}
            </span>
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            placeholder="Écris un commentaire..."
          />

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Astuce : sois gentil 🙂 (comme le design 🌿)
            </p>

            <button
              onClick={handleAddComment}
              disabled={isSending || !newComment.trim()}
              className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              title="Commenter"
            >
              {isSending ? "⏳" : "🗨️"}
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-6">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900">
              🗂️ Commentaires
            </h2>
            <span className="text-sm text-slate-500">
              {loadingComments ? "" : `${comments.length} commentaire(s)`}
            </span>
          </div>

          {loadingComments ? (
            <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <Loader />
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <EmptyState
                title="Aucun commentaire"
                description="Sois le premier à commenter 🙂"
              />
            </div>
          ) : (
            <div className="grid gap-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      👤 {getUserName(c.authorId)}
                    </span>
                    <span className="text-xs text-slate-400">#{c.id}</span>
                  </div>

                  <p className="text-slate-800 leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;