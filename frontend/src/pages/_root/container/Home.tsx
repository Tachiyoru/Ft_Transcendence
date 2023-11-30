import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "../../../services/UserSlice";

const Home = () => {
  const dispatch = useDispatch();


  const handleLogout = () => {
    dispatch(setLogout())
  }

  return (
  <div>
    <button className="text-red-500 underline" onClick={handleLogout}>
      Logout
    </button>
  </div>

  )
}

export default Home