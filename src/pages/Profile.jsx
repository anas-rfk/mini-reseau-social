import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPosts } from "../features/posts/thunks";
import { fetchUsers } from "../features/users/thunks";
import PostCard from "../components/PostCard";

import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";

import { selectPostsByUserIdLocal } from "../selectors/profilePosts.selector"; // ✅ NEW

function Profile() {
  const { id } = useParams();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const [postsData, usersData] = await Promise.all([
          fetchPosts(),
          fetchUsers(),
        ]);

        setPosts(postsData);
        setUsers(usersData);
      } catch (e) {
        console.error("PROFILE FETCH ERROR:", e);
        setError("Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  const user = users.find((u) => String(u.id) === String(id));

  // ✅ plus de filter/reverse dans le composant
  const userPosts = selectPostsByUserIdLocal(posts, id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <EmptyState
            title="Utilisateur introuvable"
            description="Ce profil n'existe pas."
            actionLabel="Retour Home"
            actionTo="/"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header Profile */}
        <div className="mb-8 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900">
                👤 Profil de {user.username}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Découvre les posts publiés par cet utilisateur 🌿
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                📝 {userPosts.length} post(s)
              </div>

              <Link
                to="/"
                className="rounded-full border border-emerald-200 bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md"
              >
                ⬅️ Retour
              </Link>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div>
          <h2 className="mb-4 text-2xl font-extrabold text-slate-900">📂 Posts</h2>

          {userPosts.length === 0 ? (
            <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <EmptyState
                title="Aucun post"
                description="Cet utilisateur n’a pas encore publié."
              />
            </div>
          ) : (
            <div className="grid gap-4">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  authorName={user.username}
                  showActions
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;