import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPosts } from "../features/posts/thunks";
import { fetchUsers } from "../features/users/thunks";
import PostCard from "../components/PostCard";

function Profile() {
  const { id } = useParams(); // id depuis l’URL

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchPosts().then(setPosts);
    fetchUsers().then(setUsers);
  }, []);

  const user = users.find((u) => String(u.id) === String(id));

  const userPosts = posts.filter(
    (post) => String(post.authorId) === String(id)
  );

  if (!user) {
    return <p>Utilisateur introuvable</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Profil de {user.username}</h1>

      <h2>Posts</h2>

      {userPosts.length === 0 ? (
        <p>Aucun post</p>
      ) : (
        userPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            authorName={user.username}
          />
        ))
      )}
    </div>
  );
}

export default Profile;