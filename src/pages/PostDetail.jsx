import { useParams, useLocation } from "react-router-dom";

function PostDetail() {
  const { id } = useParams();
  const { pathname } = useLocation();

  return (
    <div style={{ padding: 20 }}>
      <h1>Post Detail</h1>
      <p>id: {id}</p>
      <p>pathname: {pathname}</p>
    </div>
  );
}

export default PostDetail;
