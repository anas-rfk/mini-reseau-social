import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../selectors/auth.selectors";

function ProtectedRoute({ children }) {
  const currentUser = useSelector(selectCurrentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
