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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // ✅ Important: tu utilises likedBy dans PostCard
    // donc on initialise likedBy dès la création
    const newPost = {
      content,
      image,
      hashtags: hashtagsArray,
      authorId: currentUser.id,
      likedBy: [], // ✅ pour être cohérent avec ton système de likes
    };

    try {
      setIsSubmitting(true);
      const res = await axios.post(`${API_URL}/posts`, newPost);
      console.log("CREATED POST:", res.data);

      setContent("");
      setImage("");
      setHashtags("");

      navigate("/", {
        state: { successMessage: "Votre post est publié 🎉" },
      });
    } catch (err) {
      console.error("CREATE POST ERROR:", err);
      setError("Erreur lors de la création du post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            ➕ Nouveau post
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Partage quelque chose de sympa (vert & clean 🌿).
          </p>
          {/* (debug) */}
          <p className="mt-1 text-xs text-slate-400">pathname: {location.pathname}</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          {/* Error */}
          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Content */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Contenu
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                placeholder="Écris ton post ici..."
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Image (URL)
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                placeholder="https://picsum.photos/800/450"
              />

              {/* Preview */}
              {image?.trim() && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50">
                  <img
                    src={image}
                    alt="preview"
                    className="h-56 w-full object-cover transition duration-300 hover:scale-[1.02]"
                    onError={() => setError("URL image invalide (preview).")}
                  />
                </div>
              )}
            </div>

            {/* Hashtags */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Hashtags <span className="text-slate-400">(séparés par des virgules)</span>
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                placeholder="react, frontend, js"
              />

              {/* Mini preview hashtags */}
              {hashtags.trim() && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {hashtags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .slice(0, 8)
                    .map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      >
                        #{t}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-full border border-emerald-200 bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md active:translate-y-0"
              >
                ⬅️ Retour
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "⏳ Publication..." : "✅ Publier"}
              </button>
            </div>
          </form>
        </div>

        {/* Tip */}
        <div className="mt-5 rounded-3xl border border-emerald-100 bg-white p-4 text-sm text-slate-600 shadow-sm">
          💡 Astuce : utilise une image “picsum” pour tester rapidement :
          <span className="ml-2 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
            https://picsum.photos/800/450
          </span>
        </div>
      </div>
    </div>
  );
}

export default NewPost;