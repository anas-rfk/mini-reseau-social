import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { selectCurrentUser } from "../selectors/auth.selectors";
import {
  selectAllHashtags,
  selectFilteredPosts,
  selectHashtagFilter,
} from "../selectors/posts.selectors";

import { fetchPosts } from "../features/posts/thunks";
import { fetchUsers } from "../features/users/thunks";

import { setPosts, updatePost, removePost, setHashtagFilter } from "../features/posts/slice";

import PostCard from "../components/PostCard";

function Home() {
  const location = useLocation();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);

  // ✅ posts viennent de Redux
  const posts = useSelector(selectFilteredPosts);
  const hashtagFilter = useSelector(selectHashtagFilter);
  const allHashtags = useSelector(selectAllHashtags);

  // ✅ users restent en local (comme ton code)
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Fetch posts => dispatch Redux
  useEffect(() => {
    fetchPosts()
      .then((data) => dispatch(setPosts(data)))
      .catch((err) => console.error("FETCH POSTS ERROR:", err));
  }, [dispatch]);

  // ✅ Fetch users local
  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error("FETCH USERS ERROR:", err));
  }, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  }, [location.state]);

  const getAuthorName = (authorId) => {
    const user = users.find((u) => String(u.id) === String(authorId));
    return user ? user.username : "Unknown";
  };

  // ✅ ton lien "post detail" => 1er post DU USER connecté
  const myFirstPost = useMemo(() => {
    return posts.find((p) => String(p.authorId) === String(currentUser?.id));
  }, [posts, currentUser?.id]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Home (liste des posts)</h1>

      {successMessage && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        >
          {successMessage}
        </div>
      )}

      <p>pathname: {location.pathname}</p>

      {/* Links de test */}
      <p>
        Test link: <Link to="/posts/new">/posts/new</Link>
      </p>
      <p>
        Test edit: <Link to="/posts/edit/1">/posts/edit/1</Link>
      </p>
      <p>
        Test my posts: <Link to="/my-posts">/my-posts</Link>
      </p>

      <p>
        Test post detail:{" "}
        {myFirstPost ? (
          <Link to={`/post/${myFirstPost.id}`}>/post/{myFirstPost.id}</Link>
        ) : (
          "Aucun post à toi"
        )}
      </p>

      {/* My profile */}
      <p>
        My profile:{" "}
        <Link to={`/profile/${currentUser?.id}`}>/profile/{currentUser?.id}</Link>
      </p>

      <hr />

      {/* ✅ UI Filter hashtag (simple) */}
      <h2>Filtres</h2>

      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>
          Filtrer par hashtag:
        </label>

        <select
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
            style={{ marginLeft: 10 }}
            onClick={() => dispatch(setHashtagFilter(""))}
          >
            Reset
          </button>
        )}
      </div>

      <hr />

      <h2>Posts</h2>

      {posts.length === 0 ? (
        <p>Aucun post...</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            authorName={getAuthorName(post.authorId)}
            showActions
            onDeleted={(deletedId) => dispatch(removePost(deletedId))}
            onUpdated={(updatedPost) => dispatch(updatePost(updatedPost))}
          />
        ))
      )}
    </div>
  );
}

export default Home;
