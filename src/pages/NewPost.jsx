import { useLocation } from "react-router-dom";

function NewPost() {
  const { pathname } = useLocation();
  return (
    <div style={{ padding: 20 }}>
      <h1>New Post</h1>
      <p>pathname: {pathname}</p>
    </div>
  );
}

export default NewPost;
