import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../selectors/auth.selectors";
import { logout } from "../features/auth/slice";

function Navbar() {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const linkStyle =
    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 hover:bg-emerald-100 hover:text-emerald-700";

  const activeStyle =
    "bg-emerald-600 text-white hover:bg-emerald-700";

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-100 bg-white shadow-sm">
      
      {/* 👇 On enlève max-w-6xl et mx-auto */}
      <div className="flex items-center justify-between px-6 py-3">

        {/* Left side */}
        <div className="flex items-center gap-4">
          
          <span className="text-xl font-extrabold text-emerald-600">
            🌿 MiniSocial
          </span>

          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : "text-slate-700"}`
            }
          >
            🏠 Home
          </NavLink>

          <NavLink
            to="/posts/new"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : "text-slate-700"}`
            }
          >
            ➕ New
          </NavLink>

          <NavLink
            to="/my-posts"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : "text-slate-700"}`
            }
          >
            📂 My Posts
          </NavLink>

          {currentUser?.id && (
            <NavLink
              to={`/profile/${currentUser.id}`}
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? activeStyle : "text-slate-700"}`
              }
            >
              👤 Profile
            </NavLink>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
            {currentUser?.username}
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-red-600 hover:scale-105 active:scale-95"
          >
            🚪
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;