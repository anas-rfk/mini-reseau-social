import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPosts } from "../features/posts/thunks";
import { fetchUsers } from "../features/users/thunks";
import axios from "axios";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../selectors/auth.selectors";



const API_URL = "http://localhost:3001";

function PostDetail() {
  const { id } = useParams(); // post id depuis l'URL

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const currentUser = useSelector(selectCurrentUser);
  const [newComment, setNewComment] = useState("");
  

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

  const handleAddComment = async () => {
  if (!newComment.trim()) return;

  try {
    const res = await axios.post(`${API_URL}/comments`, {
      postId: Number(id),
      authorId: currentUser.id,
      content: newComment,
    });

    setComments((prev) => [...prev, res.data]);
    setNewComment("");
  } catch (err) {
    console.error("ADD COMMENT ERROR:", err);
  }
};


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
        <h3>Ajouter un commentaire</h3>

      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        rows={3}
        style={{ width: "100%", maxWidth: 600 }}
      />

      <button
        onClick={handleAddComment}
        style={{
          marginTop: 8,
          padding: "6px 12px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 5,
        }}
      >
        Commenter
      </button>


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
