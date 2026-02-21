// src/selectors/postDetail.selector.js

// ✅ Trouver un post par id
export const selectPostByIdLocal = (posts, postId) => {
  return posts.find((p) => String(p.id) === String(postId)) || null;
};

// ✅ Trier les commentaires (dernier en premier) sans modifier l'original
export const selectCommentsNewestFirstLocal = (comments) => {
  return [...comments].reverse();
};