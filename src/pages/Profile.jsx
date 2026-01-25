import { useParams, useLocation } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  const { pathname } = useLocation();

  return (
    <div style={{ padding: 20 }}>
      <h1>Profile</h1>
      <p>user id: {id}</p>
      <p>pathname: {pathname}</p>
    </div>
  );
}

export default Profile;
