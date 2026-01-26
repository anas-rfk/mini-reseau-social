import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3001";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    axios
      .get(`${API_URL}/posts/${id}`)
      .then((res) => {
        const post = res.data;

        if (!post) {
          setError("Post introuvable.");
          setLoading(false);
          return;
        }

        setContent(post.content || "");
        setImage(post.image || "");
        setHashtags((post.hashtags || []).join(", "));
        setLoading(false);
      })
      .catch((err) => {
        console.error("FETCH POST ERROR:", err);
        setError("Erreur lors de la récupération du post.");
        setLoading(false);
      });
  }, [id]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const updatedPost = {
      content,
      image,
      hashtags: hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      await axios.patch(`${API_URL}/posts/${id}`, updatedPost);

      
      navigate("/", {
        state: {
          successMessage: "Post modifié avec succès ✨",
        },
      });
    } catch (err) {
      console.error("UPDATE POST ERROR:", err);
      setError("Erreur lors de la modification du post.");
    }
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Chargement du post...</p>;
  }

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Modifier le post</h1>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Contenu</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{ width: "100%" }}
            required
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Image (URL)</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={{ width: "100%" }}
            placeholder="https://picsum.photos/400/300"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Hashtags (séparés par des virgules)</label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="react, frontend, js"
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit" style={{ marginTop: 12 }}>
          Modifier le post
        </button>
      </form>
    </div>
  );
}

export default EditPost;
