import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../selectors/auth.selectors";
import { fetchPosts } from "../features/posts/thunks";
import { fetchUsers } from "../features/users/thunks";
import PostCard from "../components/PostCard";

function MyPosts() {
  const currentUser = useSelector(selectCurrentUser);

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchPosts().then(setPosts);
    fetchUsers().then(setUsers);
  }, []);

  const getAuthorName = (authorId) => {
    const user = users.find((u) => String(u.id) === String(authorId));
    return user ? user.username : "Unknown";
  };

  const handleDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => String(p.id) !== String(deletedId)));
  };

  const myPosts = posts.filter(
    (post) => String(post.authorId) === String(currentUser?.id)
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Mes posts</h1>

      {myPosts.length === 0 ? (
        <p>Aucun post</p>
      ) : (
        myPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            authorName={getAuthorName(post.authorId)}
            onDeleted={(deletedId) =>
            setPosts((prev) => prev.filter((p) => p.id !== deletedId))
            }
            onUpdated={(updatedPost) =>
              setPosts((prev) =>
                prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
              )
            }
            
          />
        ))
      )}
    </div>
  );
}

export default MyPosts;
