import { FaMagnifyingGlass, FaBell } from "react-icons/fa6";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "../../../axios/api";

interface NavItemProps {
  name: string;
  icon: IconType;
  onClick: () => void;
  selectedSection?: string | null;
}

interface Notification {
  id: number;
  content: string;
  read: boolean;
  // Ajoutez d'autres propriétés de notification si nécessaire
}

const navItemsInfo = [
  { name: "Research", icon: FaMagnifyingGlass },
  { name: "Notifications", icon: FaBell },
  { name: "Settings", icon: MdSettings },
];

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  name,
  onClick,
  selectedSection,
}) => {
  const [showDescription, setShowDescription] = useState(false);

  const linkContent =
    name === "Settings" ? (
      <Link to="/settings">
        <Icon size={16} />
      </Link>
    ) : (
      <Icon size={14} />
    );

  return (
    <div className="relative group">
      {/* ICON */}
      <div
        className="px-3 py-2 flex items-center text-purple relative hover:text-fuchsia"
        onMouseEnter={() => setShowDescription(true)}
        onMouseLeave={() => setShowDescription(false)}
        onClick={() => onClick()}
      >
        {linkContent}
      </div>

      {/* DESCRIPTION */}
      {showDescription && !selectedSection && (
        <span className="absolute left-1/2 transform -translate-x-1/2 top-8 text-sm font-normal text-white py-1 px-2 bg-gray-400 rounded-lg">
          {name === "Notifications" && "Notifications"}
          {name === "Settings" && "Settings"}
        </span>
      )}
    </div>
  );
};

const NavHorizontal = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [prevSelectedSection, setPrevSelectedSection] = useState<string | null>(
    null
  );
  const [listUsers, setListUsers] = useState<{ username: string }[]>([]);
  const [searchValue, setSearchValue] = useState<string>(""); // État pour la valeur de recherche
  const [showUserList, setShowUserList] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<{ username: string }[]>("/users/all");
        setListUsers(response.data);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    fetchUserData();
  }, []);

  const filteredUsers = listUsers.filter((user) =>
    user.username.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleUserClick = () => {
    setShowUserList(false);
  };

  const toggleSection = (sectionName: string) => {
    if (selectedSection === sectionName || prevSelectedSection == sectionName) {
      setPrevSelectedSection(null);
      setSelectedSection(null);
    } else {
      setPrevSelectedSection(sectionName);
      setSelectedSection(sectionName);
    }
  };

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSelectedSection(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const getLoggedInUserInfo = async (): Promise<{ id: number }> => {
    console.log("getLoggedInUserInfo");
    try {
      const response = await axios.get<{ id: number }>("/users/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching logged-in user info:", error);
      return { id: -1 }; // Retourne un ID par défaut (vous pouvez ajuster selon vos besoins)
    }
  };

  const getNotifications = async (userId: number): Promise<Notification[]> => {
    try {
      const response = await axios.get<Notification[]>(
        `/notification/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  };
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationClicked, setNotificationClicked] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const handleNotificationClick = useCallback(async () => {
    console.log("handleNotificationClick, selectedSection : ", selectedSection);
    if (selectedSection === "Notifications") {
      try {
        const { id: userId } = await getLoggedInUserInfo();
        console.log("userId in handleNotificationClick : ", userId);
        const fetchedNotifications = await getNotifications(userId);
        console.log(
          "fetchedNotifications in handleNotificationClick : ",
          fetchedNotifications
        );
        setNotifications(fetchedNotifications);
        // Déplacer la logique de toggleSection ici
        setNotificationVisible(true);
      } catch (error) {
        console.error("Error fetching and setting notifications:", error);
      }
    }
  }, [selectedSection, notificationVisible]);

  useEffect(() => {
    if (selectedSection === "Notifications") {
      handleNotificationClick();
    }
  }, [selectedSection, handleNotificationClick]);

  const [selectedNotificationId, setSelectedNotificationId] = useState<
    number | null
  >(null);

  const handleNotificationItemClick = (notificationId: number) => {
    setSelectedNotificationId(notificationId);

    const markNotificationAsRead = async () => {
      try {
        const { id: userId } = await getLoggedInUserInfo();
        await axios.patch(`notification/read/${userId}/${notificationId}`, {
          read: true,
        });
        const updatedNotifications = notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        );

        setNotifications(updatedNotifications);
        console.log("updatedNotifications : ", updatedNotifications);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    };

    markNotificationAsRead();
  };

  const getContent = () => {
    console.log("getContent, selectedSection : ", selectedSection);
    if (selectedSection === "Notifications") {
      return (
        <div
          ref={menuRef}
          className="shadow-md bg-dark-violet rounded-lg py-2 px-4 absolute right-2 mt-1"
        >
          <div className="text-xs font-normal text-param">Notifications</div>
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`border ${
                  notification.read ? "border-gray-500" : "border-white"
                }`}
                onClick={() => handleNotificationItemClick(notification.id)}
              >
                <span className="text-white">{notification.content}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <section>
      <header className="flex justify-between pt-4 pb-4">
        {/* LOGO */}
        <div>
          <img src="" alt="" className="w-16" />
        </div>

        {/* NAV */}
        <div className="right-0">
          <ul className="flex gap-x-1 text-xs">
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setShowUserList(true);
                }}
              />
              {showUserList && (
                <ul className="absolute h-24 w-full bg-lilac z-10">
                  {filteredUsers.map((user, index) => (
                    <li
                      key={index}
                      className="px-2 py-1 hover:bg-purple cursor-pointer"
                      onClick={() => handleUserClick()}
                    >
                      <Link to={`/user/${user.username}`}>{user.username}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {navItemsInfo.map((item, index) => (
              <div key={index}>
                <li>
                  <NavItem
                    icon={item.icon}
                    name={item.name}
                    onClick={() => {
                      toggleSection(item.name);
                      handleNotificationClick();
                    }}
                    selectedSection={selectedSection}
                  />
                </li>

                {selectedSection === item.name && (
                  <div className="relative">{getContent()}</div>
                )}
              </div>
            ))}
          </ul>
        </div>
      </header>
    </section>
  );
};

export default NavHorizontal;
