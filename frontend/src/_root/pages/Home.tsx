import { Link } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const {authenticated, setAuthenticated} = useContext(AuthContext)

  const handleLogout = () => {
    setAuthenticated(false);
  };

  return (
  <div>
    <Link to="/profil" className="text-sm underline ">
      Profil
    </Link>
    <button onClick={handleLogout}>Déconnexion</button>
  </div>

  )
}

export default Home