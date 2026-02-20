import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectCurrentUser } from "../selectors/auth.selectors";
import { fetchPosts } from "../features/posts/thunks";
import { fetchUsers } from "../features/users/thunks";

import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

function MyPosts() {
  const currentUser = useSelector(selectCurrentUser);

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const [status, setStatus] = useState("idle"); // idle | loading | succeeded | failed
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        setStatus("loading");
        setError(null);

        const [postsData, usersData] = await Promise.all([
          fetchPosts(),
          fetchUsers(),
        ]);

        setPosts(postsData);
        setUsers(usersData);

        setStatus("succeeded");
      } catch (e) {
        console.error("MY POSTS FETCH ERROR:", e);
        setError(e?.message || "Erreur API");
        setStatus("failed");
      }
    };

    run();
  }, []);

  const getAuthorName = (authorId) => {
    const user = users.find((u) => String(u.id) === String(authorId));
    return user ? user.username : "Unknown";
  };

  const myPosts = useMemo(() => {
    const filtered = posts.filter(
      (post) => String(post.authorId) === String(currentUser?.id)
    );

    // ✅ dernier en premier
    return [...filtered].reverse();
  }, [posts, currentUser?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              📂 Mes posts
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Tous tes posts, du plus récent au plus ancien.
            </p>
          </div>

          <Link
            to="/posts/new"
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md active:translate-y-0"
          >
            ➕ Nouveau
          </Link>
        </div>

        {/* Loading / Error */}
        {status === "loading" && (
          <div className="mb-6">
            <Loader />
          </div>
        )}

        {status === "failed" && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Content */}
        {status === "succeeded" && myPosts.length === 0 ? (
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <EmptyState
              title="Tu n’as pas encore de posts"
              description="Crée ton premier post et il apparaîtra ici 🙂"
              actionLabel="Créer un post"
              actionTo="/posts/new"
            />
          </div>
        ) : (
          <div className="grid gap-4">
            {myPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                authorName={getAuthorName(post.authorId)}
                showActions
                onDeleted={(deletedId) =>
                  setPosts((prev) =>
                    prev.filter((p) => String(p.id) !== String(deletedId))
                  )
                }
                onUpdated={(updatedPost) =>
                  setPosts((prev) =>
                    prev.map((p) =>
                      String(p.id) === String(updatedPost.id) ? updatedPost : p
                    )
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPosts;