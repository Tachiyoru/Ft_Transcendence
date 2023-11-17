import { Link } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  }

  return (
  <div>
    <Link to="/profil" className="text-sm underline ">
      Profil
    </Link>
    <button onClick={handleLogout}>
      Logout
    </button>
  </div>

  )
}

export default Home