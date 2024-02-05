import { FaMagnifyingGlass, FaBell, FaTrophy, FaUserPlus, FaXmark, FaCheck } from "react-icons/fa6";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../axios/api";
import { IconType } from "react-icons";
import { WebSocketContext } from "../../../socket/socket";
import { RiGamepadFill, RiMessage3Fill } from "react-icons/ri";
import { LuBadgeCheck } from "react-icons/lu";

interface NavItemProps {
  name: string;
  icon: IconType;
  onClick: () => void;
  selectedSection?: string | null;
  unreadNotifications: number | 0;
}

interface Notification {
  id: number;
  content: string;
  read: boolean;
  type: number;
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
  unreadNotifications,
}) => {
  const [showDescription, setShowDescription] = useState(false);

  const linkContent =
    name === "Settings" ? (
      <Link to="/settings">
        <Icon size={16} />
      </Link>
    ) : (
      <>
        <Icon size={14} />
        {name === "Notifications" && unreadNotifications > 0 && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-orange rounded-full flex items-center justify-center">
            <span className="text-white text-xss font-semibold">
              {unreadNotifications}
            </span>
          </div>
        )}
      </>
    );

  return (
    <div className="relative group" style={{ cursor: "pointer" }}>
      {/* ICON */}
      <div
        className="px-3 py-2 flex items-center text-purple relative hover:text-fuchsia transition duration-300 ease-in-out hover:scale-125"
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

export const getLoggedInUserInfo = async (): Promise<{ id: number }> => {
  try {
    const response = await axios.get<{ id: number }>("/users/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching logged-in user info:", error);
    return { id: -1 }; 
  }
};

export const getNotifications = async (
  id: number
): Promise<Notification[]> => {
  try {
    const response = await axios.get<Notification[]>(`/notification/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationVisible, setNotificationVisible] = useState(false);
	const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    number | null
  >(null);

const socket = useContext(WebSocketContext);

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

  useEffect(() => {
      socket.emit("unread-notification");
      socket.on("unread-notification-array", (notification) => {
				if (notification)
					setUnreadNotifications(notification.length);
			});
	  return () => {
		  socket.off("unread-notification-array");
	  }
	}, [socket]);


  const handleNotificationClick = useCallback(async () => {
    if (selectedSection === "Notifications") {
      try {
        const { id: userId } = await getLoggedInUserInfo();
        const fetchedNotifications = await getNotifications(userId);
        setNotifications(fetchedNotifications);

        setHasNewNotifications(true);
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

  const [notificationRedirect, setNotificationRedirect] = useState<string>("/");
  0;
  const getNotificationRedirect = (type: number) => {
		if (type == 0)
			return "/friends#invitations";
		else if (type == 1)
			return "/friends#tous"
		else if (type == 2)
			return ""
		else if (type == 3)
			return "/"
		else if (type == 4)
			return "/chat"
		else if (type == 5)
			return "/chat"
		else if (type == 6)
			return "/chat"
		else
			return "/";
  };

	const markNotificationAsRead = async (notificationId: number) => {
		socket.emit("update-notification-number", { notifId: notificationId });
	};
	
  const handleNotificationItemClick = (
		notificationId: number,
    notificationType: number
		) =>
		{
			if (notificationType === 2)
			return ;
		setSelectedNotificationId(notificationId);
    markNotificationAsRead(notificationId);
		setSelectedSection(null);
  };

  const getContent = () => {
    if (selectedSection === "Notifications") {
      return (
        <>
        {notifications.length > 0 ? (
          <div
            ref={menuRef}
            className="shadow-md bg-dark-violet w-44 rounded-lg py-2 px-4 absolute right-2 mt-1"
            style={{ cursor: "default", zIndex: 1 }}
          >
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex flex-row text-fushia text-xs py-2 ${
                    notification.read ? "text-opacity-40 text-lilac" : ""
                  }`}
                  onClick={() =>
                    handleNotificationItemClick(
                      notification.id,
                      notification.type
                    )
                  }
                >
                    {notification.type === 3 && <FaTrophy className="mr-2 w-7 h-5"/>}
                    {notification.type === 0 && <FaUserPlus className="mr-2 w-5 h-5"/>}
                    {notification.type === 1 && <FaUserPlus className="mr-2 w-5 h-5"/>}
                    {notification.type === 5 && <RiMessage3Fill className="mr-2 w-7 h-5"/>}
										{notification.type === 6 && <LuBadgeCheck className="mr-2 w-7 h-5" />}
									{notification.type === 2 && <RiGamepadFill className="mr-2 w-7 h-5" />}
									<div>
										{notification.type === 2 ? (<span>{notification.content}</span>) : (
										<Link to={getNotificationRedirect(notification.type)}>
											<span className="hover:underline">{notification.content}</span>
									</Link>
										)}
											{notification.type === 2 && (
											<div className="flex flex-row gap-x-6 mt-1">
												<Link to={'/game'}
													onClick={() =>
													{
														markNotificationAsRead(notification.id);
														setSelectedSection(null);
													}}
												>
												<div 
													className="w-[26px] h-[26px] mt-1 bg-violet-black rounded-full grid justify-items-center items-center hover:bg-purple"
													style={{cursor: 'pointer'}}
													>
													<FaCheck className="w-[10px] h-[10px] text-acid-green"/>
													</div>
													</Link>
												<div 
													className="w-[26px] h-[26px] mt-1 bg-violet-black rounded-full grid justify-items-center items-center hover:bg-purple"
													onClick={() =>
													{
														markNotificationAsRead(notification.id);
														setSelectedSection(null);
													}}
													style={{cursor: 'pointer'}}
													>
													<FaXmark className="w-[10px] h-[10px] text-red-orange"/>
												</div>
											</div>
											)}
									</div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        </>
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
                className="bg-dark-violet text-lilac px-2 rounded py-0.5 focus:outline-none"
              />
              {showUserList && (
                <ul className="absolute h-24 w-full bg-lilac z-10">
                  {filteredUsers.map((user, index) => (
                    <Link to={`/user/${user.username}`}>
                        <li
                          key={index}
                          className="px-2 py-1 hover:bg-purple cursor-pointer"
                          onClick={() => handleUserClick()}
                        >
                          {user.username}
                        </li>
                    </Link>
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
                    unreadNotifications={unreadNotifications}
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
