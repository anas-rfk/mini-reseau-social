// posts.selectors.js
import { createSelector } from "@reduxjs/toolkit";

export const selectPosts = (state) => state.posts.items;

export const selectHashtagFilter = (state) => state.posts.hashtagFilter;

export const selectAuthorFilter = (state) => state.posts.authorFilter;

export const selectCurrentUser = (state) => state.auth.currentUser;

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
  const posts = selectFilteredPosts(state);
  const authorId = selectAuthorFilter(state);

  let filtered = posts;
  if (authorId) {
    filtered = posts.filter((p) => String(p.authorId) === String(authorId));
  }

  return [...filtered].reverse();
};

// ✅ NOUVEAU: Mes posts (currentUser) triés (dernier en premier)
export const selectMyPosts = createSelector(
  [selectPosts, selectCurrentUser],
  (posts, currentUser) => {
    if (!currentUser) return [];
    const mine = posts.filter(
      (p) => String(p.authorId) === String(currentUser.id)
    );
    return [...mine].reverse();
  }
);

// ✅ NOUVEAU: Posts d’un utilisateur par id (pour Profile) triés
export const makeSelectPostsByUserId = (userId) =>
  createSelector([selectPosts], (posts) => {
    const filtered = posts.filter(
      (p) => String(p.authorId) === String(userId)
    );
    return [...filtered].reverse();
  });