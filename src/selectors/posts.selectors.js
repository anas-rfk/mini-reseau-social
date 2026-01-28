export const selectPosts = (state) => state.posts.items;

export const selectHashtagFilter = (state) => state.posts.hashtagFilter;

// Liste des hashtags uniques (pour dropdown/chips)
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

// Posts filtrés par hashtag
export const selectFilteredPosts = (state) => {
  const posts = selectPosts(state);
  const filter = selectHashtagFilter(state).trim().toLowerCase();

  if (!filter) return posts;

  return posts.filter((p) =>
    (p.hashtags || []).map((h) => String(h).trim().toLowerCase()).includes(filter)
  );
};
