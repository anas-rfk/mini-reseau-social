import { useLocation } from "react-router-dom";

function MyPosts() {
  const { pathname } = useLocation();

  return (
    <div style={{ padding: 20 }}>
      <h1>My Posts</h1>
      <p>pathname: {pathname}</p>
    </div>
  );
}

export default MyPosts;
