// posts.selectors.js

export const selectPosts = (state) => state.posts.items;

export const selectHashtagFilter = (state) => state.posts.hashtagFilter;

export const selectAuthorFilter = (state) => state.posts.authorFilter;

// ✅ Liste des hashtags uniques (pour dropdown/chips)
export const selectAllHashtags = (state) => {
  const posts = selectPosts(state);
  const set = new Set();

  posts.forEach((p) => {
    (p.hashtags || []).forEach((h) => {
      if (h) set.add(String(h).trim().toLowerCase());
    });
  });

  return Array.from(set);
};

// ✅ Posts filtrés par hashtag
export const selectFilteredPosts = (state) => {
  const posts = selectPosts(state);
  const filter = selectHashtagFilter(state).trim().toLowerCase();

  if (!filter) return posts;

  return posts.filter((p) =>
    (p.hashtags || [])
      .map((h) => String(h).trim().toLowerCase())
      .includes(filter)
  );
};

// ✅ Posts filtrés par hashtag + auteur + tri (dernier en premier)
export const selectFilteredPostsByAuthor = (state) => {
  const posts = selectFilteredPosts(state); // combine hashtag
  const authorId = selectAuthorFilter(state);

  // 1) filtre auteur si besoin
  let filtered = posts;
  if (authorId) {
    filtered = posts.filter((p) => String(p.authorId) === String(authorId));
  }

  // 2) tri : dernier post ajouté => en premier
  // JSON Server ajoute les nouveaux posts à la fin du tableau
  // reverse() les met en haut
  return [...filtered].reverse();
};