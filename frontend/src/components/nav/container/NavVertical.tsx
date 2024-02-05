import { GoHomeFill } from "react-icons/go";
import { RiGamepadFill, RiMessage3Fill } from "react-icons/ri";
import { FaArrowRightFromBracket, FaUserGroup } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../../../services/UserSlice";
import { useDispatch } from "react-redux";
import axios from "../../../axios/api";
import { WebSocketContext } from "../../../socket/socket";
import { useContext, useEffect, useState } from "react";

interface NavItemProps {
  lien: string;
  icon: string;
  badge?: number;
}

interface Channel {
  name: string;
  read: string[];
  members: User[];
}

interface User {
  username: string;
  avatar: string;
  email: string;
  createdAt: string;
  channel: Channel[];
  blockedList: User[];
}

const NavVertical: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const [userData, setUserData] = useState<User>();
  const [actuReceived, setActuReceived] = useState<boolean>(false);
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);

  const navItemsInfo = [
    { name: "Dashboard", type: "link", lien: "/", icon: GoHomeFill, badges: 0 },
    {
      name: "Game",
      type: "link",
      lien: "/game",
      icon: RiGamepadFill,
      badges: 0,
    },
    {
      name: "Chat",
      type: "link",
      lien: "/chat",
      icon: RiMessage3Fill,
      badges: 1,
    },
    {
      name: "Friends",
      type: "link",
      lien: "/friends",
      icon: FaUserGroup,
      badges: 0,
    },
  ];

  const renderBadge = () => (
    <div className="notification-badge">
      <div
        style={{
          backgroundColor: "red",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          position: "absolute",
          top: "1px",
          left: "4px",
        }}
      ></div>
    </div>
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await axios.get("/users/mee");
        setUserData(userDataResponse.data);
		await axios
        .get<User[]>("friends-list/blocked-users")
        .then((response) => {
			setBlockedUsers(response.data);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des non-amis:", error);
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    setActuReceived(false);
    fetchData();
  }, [actuReceived]);

  const checkRead = () => {
    if (userData) {
      for (const channel of userData.channel) {
		if (blockedUsers && blockedUsers.filter((user) => user.username === channel.members.filter((member) => member.username !== userData.username)[0].username).length > 0) {
			return null;}
        if (channel.read.includes(userData.username)) {
          return renderBadge();
        }
      }
    }
  };

  useEffect(() => {
    const handleActuEvent = () => {
      setActuReceived(true);
    };
    socket.on("actu", handleActuEvent);

    return () => {
      socket.off("actu", handleActuEvent);
    };
  }, [socket]);

  const NavItem: React.FC<NavItemProps & { currentPage: string }> = ({
    lien,
    icon: Icon,
    currentPage,
    badge,
  }) => {
    const isCurrentPage = lien === currentPage;
    const iconColorClass = isCurrentPage
      ? "text-fushia bg-purple"
      : "text-accent-violet";

    if (!lien) {
      return null;
    }
    return (
      <li className="relative group">
        <Link
          to={lien}
          className={`px-3 py-3 flex items-center ${iconColorClass} bg-violet-black mb-4 mr-4 rounded-lg transition duration-300 ease-in-out hover:bg-purple hover:scale-110`}
        >
          <Icon size={28} />
          {badge === 1 && checkRead()}
        </Link>
      </li>
    );
  };

  const handleLogout = () => {
    dispatch(setLogout());
    axios
      .post("/auth/logout")
      .then(() => {
        console.log("Déconnexion réussie");
        socket.disconnect();
        window.location.href = "/sign-in";
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion côté serveur :", error);
      });
  };

  const navItemStyle =
    "px-3 py-3 flex items-center bg-violet-black mb-4 mr-4 rounded-lg transition duration-300 ease-in-out hover:bg-purple hover:scale-110";

  return (
    <div className="flex flex-col justify-between">
      <ul className="flex-col flex-grow mt-12">
        {navItemsInfo.map((item, index) => (
          <NavItem
            key={index}
            lien={item.lien}
            icon={item.icon}
            currentPage={currentPage}
            badge={item.badges}
          />
        ))}
      </ul>
      <button
        className={`flex items-center ${navItemStyle}`}
        onClick={handleLogout}
      >
        <FaArrowRightFromBracket className="text-accent-violet" size={26} />
      </button>
    </div>
  );
};

export default NavVertical;
