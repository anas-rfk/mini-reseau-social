import { useState } from "react";
import { useLocation } from "react-router-dom";

function NewPost() {
  const location = useLocation();

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [hashtags, setHashtags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const postData = {
      content,
      image,
      hashtags: hashtags.split(",").map((tag) => tag.trim()),
    };

    console.log("POST DATA:", postData);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>New Post</h1>
      <p>pathname: {location.pathname}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Contenu</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{ width: "100%" }}
            required
          />
        </div>

        <div>
          <label>Image (URL)</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div>
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
          Créer le post
        </button>
      </form>
    </div>
  );
}

export default NewPost;
