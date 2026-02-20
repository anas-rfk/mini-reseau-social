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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);

      await axios.patch(`${API_URL}/posts/${id}`, updatedPost);

      navigate("/", {
        state: {
          successMessage: "Post modifié avec succès ✨",
        },
      });
    } catch (err) {
      console.error("UPDATE POST ERROR:", err);
      setError("Erreur lors de la modification du post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 flex items-center justify-center">
        <div className="rounded-3xl bg-white px-6 py-4 shadow-md text-emerald-600 font-semibold">
          ⏳ Chargement du post...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto max-w-3xl px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            ✏️ Modifier le post
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Mets à jour ton contenu en douceur 🌿
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

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
              />
            </div>

            {/* Image */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Image (URL)
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />

              {image?.trim() && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50">
                  <img
                    src={image}
                    alt="preview"
                    className="h-56 w-full object-cover transition duration-300 hover:scale-[1.02]"
                  />
                </div>
              )}
            </div>

            {/* Hashtags */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Hashtags
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                placeholder="react, frontend, js"
              />

              {hashtags.trim() && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {hashtags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
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
                className="rounded-full border border-emerald-200 bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md"
              >
                ⬅️ Retour
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md active:translate-y-0 disabled:opacity-60"
              >
                {isSubmitting ? "⏳ Modification..." : "✨ Modifier"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPost;