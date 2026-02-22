// src/selectors/profilePosts.selector.js

// ✅ Posts d'un user (dernier en premier) sans modifier le tableau original
export const selectPostsByUserIdLocal = (posts, userId) => {
  const filtered = (posts || []).filter(
    (p) => String(p.authorId) === String(userId)
  );

  // JSON-server ajoute les nouveaux à la fin → reverse pour les mettre en haut
  return [...filtered].reverse();
};