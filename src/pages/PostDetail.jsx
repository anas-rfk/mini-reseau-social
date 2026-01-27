import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPosts } from "../features/posts/thunks";
import { fetchUsers } from "../features/users/thunks";
import axios from "axios";
import PostCard from "../components/PostCard";

const API_URL = "http://localhost:3001";

function PostDetail() {
  const { id } = useParams(); // post id depuis l'URL

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    fetchPosts().then(setPosts).catch(console.error);
    fetchUsers().then(setUsers).catch(console.error);
      setLoadingComments(true);
    axios
      .get(`${API_URL}/comments?postId=${id}`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error("FETCH COMMENTS ERROR:", err))
      .finally(() => setLoadingComments(false));
  }, [id]);

  const post = useMemo(
    () => posts.find((p) => String(p.id) === String(id)),
    [posts, id]
  );

  const getUserName = (userId) => {
    const u = users.find((x) => String(x.id) === String(userId));
    return u ? u.username : "Unknown";
  };

  if (!post) return <p style={{ padding: 20 }}>Post introuvable</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Détails du post</h1>

      <PostCard
        post={post}
        authorName={getUserName(post.authorId)}
        onUpdated={(updatedPost) => {
          setPosts((prev) =>
            prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
          );
        }}
      />

      <hr />

      <h2>Commentaires</h2>
       
      {loadingComments ? (
        <p>Chargement...</p>
      ) : comments.length === 0 ? (
        <p>Aucun commentaire</p>
      ) : (
        comments.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
              maxWidth: 600,
            }}
          >
            <p>
              <strong>Auteur:</strong> {getUserName(c.authorId)}
            </p>
            <p>{c.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default PostDetail;
