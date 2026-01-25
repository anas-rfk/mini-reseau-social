import { useLocation, useParams } from "react-router-dom";

function EditPost() {
  const { id } = useParams();
  const { pathname } = useLocation();

  return (
    <div style={{ padding: 20 }}>
      <h1>Edit Post</h1>
      <p>id: {id}</p>
      <p>pathname: {pathname}</p>
    </div>
  );
}

export default EditPost;
