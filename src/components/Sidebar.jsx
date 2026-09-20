import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-leaf">❧</span>
        <span>Life Receipts</span>
      </div>

      <nav className="navigation">

        <Link
          className={`nav-item ${
            location.pathname === "/" ? "active" : ""
          }`}
          to="/"
        >
          <span>⌂</span>
          <span>Home</span>
        </Link>

        <Link
          className={`nav-item ${
            location.pathname === "/explore" ? "active" : ""
          }`}
          to="/explore"
        >
          <span>◈</span>
          <span>Explore</span>
        </Link>

        <Link
          className={`nav-item ${
            location.pathname === "/connections" ? "active" : ""
          }`}
          to="/connections"
        >
          <span>⌘</span>
          <span>Connections</span>
        </Link>

        <Link
          className={`nav-item ${
            location.pathname === "/story" ? "active" : ""
          }`}
          to="/story"
        >
          <span>✦</span>
          <span>Story</span>
        </Link>
<Link
  className={`nav-item ${
    location.pathname === "/search" ? "active" : ""
  }`}
  to="/search"
>
  <span>⌕</span>
  <span>Search</span>
</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;