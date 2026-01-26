import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../selectors/auth.selectors";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:3001";

function NewPost() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentUser) {
      setError("Vous devez être connecté.");
      return;
    }

    const hashtagsArray = hashtags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newPost = {
      content,
      image,
      hashtags: hashtagsArray,
      authorId: currentUser.id,
      likes: 0,
    };

    try {
      const res = await axios.post(`${API_URL}/posts`, newPost);
      console.log("CREATED POST:", res.data);

      
      setContent("");
      setImage("");
      setHashtags("");

      
      navigate("/", {
        state: {
          successMessage: "Votre post est publié 🎉",
        },
      });
    } catch (err) {
      console.error("CREATE POST ERROR:", err);
      setError("Erreur lors de la création du post.");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>New Post</h1>
      <p>pathname: {location.pathname}</p>

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}

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

        <button type="submit">Créer le post</button>
      </form>
    </div>
  );
}

export default NewPost;