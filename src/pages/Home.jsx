import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { selectCurrentUser } from "../selectors/auth.selectors";
import {
  selectAllHashtags,
  selectHashtagFilter,
  selectAuthorFilter,
  selectFilteredPostsByAuthor,
} from "../selectors/posts.selectors";

import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { fetchPosts } from "../features/posts/thunks";
import { fetchUsers } from "../features/users/thunks";

import {
  setPosts,
  updatePost,
  removePost,
  setHashtagFilter,
  setAuthorFilter,
  setPostsLoading,
  setPostsError,
} from "../features/posts/slice";

import PostCard from "../components/PostCard";

function Home() {
  const location = useLocation();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);

  const posts = useSelector(selectFilteredPostsByAuthor);
  const hashtagFilter = useSelector(selectHashtagFilter);
  const authorFilter = useSelector(selectAuthorFilter);
  const allHashtags = useSelector(selectAllHashtags);
  const postsStatus = useSelector((state) => state.posts.status);
  const postsError = useSelector((state) => state.posts.error);

  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(setPostsLoading());
    fetchPosts()
      .then((data) => dispatch(setPosts(data)))
      .catch((err) =>
        dispatch(setPostsError(err.message || "Erreur API posts"))
      );
  }, [dispatch]);

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error("FETCH USERS ERROR:", err));
  }, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      const t = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(t);
    }
  }, [location.state]);

  const getAuthorName = (authorId) => {
    const user = users.find((u) => String(u.id) === String(authorId));
    return user ? user.username : "Unknown";
  };

  const myFirstPost = useMemo(() => {
    return posts.find((p) => String(p.authorId) === String(currentUser?.id));
  }, [posts, currentUser?.id]);

  return (
  <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Home <span className="text-emerald-600">(liste des posts)</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Filtre par hashtag / auteur, puis explore les posts.
        </p>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-sm transition">
          ✅ {successMessage}
        </div>
      )}

      {/* Loading / Error */}
      {postsStatus === "loading" && (
        <div className="mb-6">
          <Loader />
        </div>
      )}

      {postsStatus === "failed" && (
        <div className="mb-6">
          <ErrorMessage message={postsError} />
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Filtres</h2>
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Hashtag */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Filtrer par hashtag
            </label>
            <div className="flex items-center gap-3">
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                value={hashtagFilter}
                onChange={(e) => dispatch(setHashtagFilter(e.target.value))}
              >
                <option value="">-- Tous --</option>
                {allHashtags.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>

              {hashtagFilter && (
                <button
                  onClick={() => dispatch(setHashtagFilter(""))}
                  className="rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md active:translate-y-0"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Filtrer par auteur
            </label>
            <div className="flex items-center gap-3">
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                value={authorFilter}
                onChange={(e) => dispatch(setAuthorFilter(e.target.value))}
              >
                <option value="">-- Tous --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>

              {authorFilter && (
                <button
                  onClick={() => dispatch(setAuthorFilter(""))}
                  className="rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md active:translate-y-0"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts header */}
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-2xl font-extrabold text-slate-900">Posts</h2>
        {postsStatus === "succeeded" && (
          <span className="text-sm text-slate-500">{posts.length} post(s)</span>
        )}
      </div>

      {/* Empty state */}
      {postsStatus === "succeeded" && posts.length === 0 ? (
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <EmptyState
            title="Aucun post pour le moment"
            description="Sois le premier à publier quelque chose 🙂"
            actionLabel="Créer un post"
            actionTo="/posts/new"
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              authorName={getAuthorName(post.authorId)}
              showActions
              onDeleted={(deletedId) => dispatch(removePost(deletedId))}
              onUpdated={(updatedPost) => dispatch(updatePost(updatedPost))}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);
}

export default Home;