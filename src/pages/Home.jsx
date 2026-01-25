import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { fetchPosts } from "../features/posts/thunks";
import { fetchUsers } from "../features/users/thunks";
import PostCard from "../components/PostCard";

function Home() {
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

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

  const getAuthorName = (authorId) => {
    const user = users.find((u) => String(u.id) === String(authorId));
    return user ? user.username : "Unknown";
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Home (liste des posts)</h1>
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
        Test post detail: <Link to="/post/1">/post/1</Link>
      </p>
      <p>
        Test profile: <Link to="/profile/1">/profile/1</Link>
      </p>

      <hr />

      {/* Affichage posts */}
      <h2>Posts</h2>

      {posts.length === 0 ? (
        <p>Aucun post...</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            authorName={getAuthorName(post.authorId)}
          />
        ))
      )}
    </div>
  );
}

export default Home;
