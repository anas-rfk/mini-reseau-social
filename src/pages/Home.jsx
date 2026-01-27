import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../selectors/auth.selectors";

import { fetchPosts } from "../features/posts/thunks";
import { fetchUsers } from "../features/users/thunks";
import PostCard from "../components/PostCard";

function Home() {
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(data))
      .catch((err) => console.error("FETCH POSTS ERROR:", err));
  }, []);

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
        Test post detail: <Link to="/post/1">/post/1</Link>
      </p>

      {/* ✅ FIX : profile basé sur le user connecté */}
      <p>
        My profile:{" "}
        <Link to={`/profile/${currentUser?.id}`}>
          /profile/{currentUser?.id}
        </Link>
      </p>

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
            onDeleted={(deletedId) =>
              setPosts((prev) => prev.filter((p) => p.id !== deletedId))
            }
            onUpdated={(updatedPost) =>
            setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)))
            }

          />
        ))
      )}
    </div>
  );
}

export default Home;
