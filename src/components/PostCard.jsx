function PostCard({ post, authorName }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        maxWidth: 600,
      }}
    >
      <p>
        <strong>Auteur:</strong> {authorName}
      </p>

      <p>
        <strong>Contenu:</strong> {post.content}
      </p>

      {post.image && (
        <img
          src={post.image}
          alt="post"
          style={{ width: "100%", maxWidth: 600, borderRadius: 8 }}
        />
      )}

      <p>
        <strong>Hashtags:</strong> {(post.hashtags || []).join(" , ")}
      </p>

      <p>
        <strong>Likes:</strong> {post.likes ?? 0}
      </p>
    </div>
  );
}

export default PostCard;
