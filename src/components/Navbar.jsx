import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="navbar">
      <div className="brand">✅ MyTask</div>
      <div className="user-info">
        {user && <span>Olá, {user.name}</span>}
        <button className="btn btn-secondary" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}
