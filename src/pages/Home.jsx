import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { selectCurrentUser } from "../selectors/auth.selectors";
import {
  selectAllHashtags,
  selectHashtagFilter,
  selectAuthorFilter,
  selectFilteredPostsByAuthor,
  selectSortBy,
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
  setSortBy,
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
  const sortBy = useSelector(selectSortBy);

  const allHashtags = useSelector(selectAllHashtags);
  const postsStatus = useSelector((state) => state.posts.status);
  const postsError = useSelector((state) => state.posts.error);

  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const POSTS_PER_PAGE = 6;
  const [page, setPage] = useState(1);
  const [isPageAnimating, setIsPageAnimating] = useState(false);

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

  // ✅ Reset page si filtre ou tri change
  useEffect(() => {
    setPage(1);
  }, [hashtagFilter, authorFilter, sortBy, posts.length]);

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    return posts.slice(start, end);
  }, [posts, page]);

  const animatePage = () => {
    setIsPageAnimating(true);
    setTimeout(() => setIsPageAnimating(false), 260);
  };

  const goToPage = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    if (next === page) return;
    setPage(next);
    animatePage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => goToPage(page - 1);
  const goNext = () => goToPage(page + 1);

  const pageNumbers = useMemo(() => {
    const max = 5;
    const half = Math.floor(max / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + max - 1);
    start = Math.max(1, end - max + 1);

    const nums = [];
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [page, totalPages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto max-w-5xl px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Home <span className="text-emerald-600">(liste des posts)</span>
          </h1>
        </div>

        {/* Success */}
        {successMessage && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-sm">
            ✅ {successMessage}
          </div>
        )}

        {/* Loading / Error */}
        {postsStatus === "loading" && <Loader />}
        {postsStatus === "failed" && <ErrorMessage message={postsError} />}

        {/* Filters */}
        <div className="mb-6 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Filtres</h2>

          {/* TRI */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Trier les posts
            </label>
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 shadow-sm focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="new">🕒 Plus récents</option>
              <option value="popular">🔥 Plus populaires</option>
            </select>
          </div>

          {/* Hashtag */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Filtrer par hashtag
            </label>
            <select
              value={hashtagFilter}
              onChange={(e) => dispatch(setHashtagFilter(e.target.value))}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 shadow-sm"
            >
              <option value="">-- Tous --</option>
              {allHashtags.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Filtrer par auteur
            </label>
            <select
              value={authorFilter}
              onChange={(e) => dispatch(setAuthorFilter(e.target.value))}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 shadow-sm"
            >
              <option value="">-- Tous --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <EmptyState
            title="Aucun post"
            description="Sois le premier à publier 🙂"
            actionLabel="Créer un post"
            actionTo="/posts/new"
          />
        ) : (
          <>
            <div
              className={`grid gap-4 transition-all duration-300 ${
                isPageAnimating ? "opacity-0 translate-y-2" : "opacity-100"
              }`}
            >
              {paginatedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  authorName={getAuthorName(post.authorId)}
                  showActions
                  onDeleted={(id) => dispatch(removePost(id))}
                  onUpdated={(updated) => dispatch(updatePost(updated))}
                />
              ))}
            </div>

            {/* Pagination */}
            {posts.length > POSTS_PER_PAGE && (
              <div className="mt-8 flex justify-center gap-2">
                <button onClick={goPrev} disabled={page === 1}>
                  ⬅️
                </button>

                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    onClick={() => goToPage(n)}
                    className={n === page ? "font-bold text-emerald-600" : ""}
                  >
                    {n}
                  </button>
                ))}

                <button onClick={goNext} disabled={page === totalPages}>
                  ➡️
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;