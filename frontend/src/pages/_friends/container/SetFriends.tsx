import React, { useEffect, useRef, useState } from "react";
import { FaArrowTurnUp, FaUser, FaUserPlus } from "react-icons/fa6";
import AllFriends from "./AllFriends";
import Invitations from "./Invitations";
import Blocked from "./Blocked";
import axios from "../../../axios/api";
import { Link } from "react-router-dom";
import { NavHorizontal } from "../../../components/nav/NavHorizontal";
import {
  getLoggedInUserInfo,
  getNotifications,
} from "../../../components/nav/container/NavHorizontal";

type FilterType = "tous" | "invitations" | "blocked";

const SetFriends: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [filtreActif, setFiltreActif] = useState<FilterType>("tous");
  const [listUsers, setListUsers] = useState<
    { id: number; username: string }[]
  >([]);
  const [checkedItems, setCheckedItems] = useState<{
    [key: string]: { id: number };
  }>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loadingFriendsList, setLoadingFriendsList] = useState(true);
  const [friendsList, setFriendsList] = useState<
    { id: number; username: string }[]
  >([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<{ id: number; username: string }[]>(
          "/friends-list/non-friends"
        );
        console.log(response.data);
        setFriendsList(response.data);
        setLoadingFriendsList(false); // Marque la fin du chargement
      } catch (error) {
        console.error("Error fetching user list:", error);
        setLoadingFriendsList(false); // Arrête le chargement en cas d'erreur
      }
    };

    if (loadingFriendsList) {
      fetchUserData();
    }
  }, [loadingFriendsList]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<{ id: number; username: string }[]>(
          "/friends-list/non-friends"
        );
        console.log(response.data);

        setListUsers(response.data);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setIsTyping(inputValue !== "");
    setSearchText(e.target.value);
  };

  const hasNewInvitations = async () => {
    const { id: userId } = await getLoggedInUserInfo();
    const fetchedNotifications = await getNotifications(userId);
    const invitationNotification = fetchedNotifications.filter(
      (notification) => notification.type === 0
    );
    console.log("invitationNotification", invitationNotification);
    return invitationNotification.length;
  };

  const [hasNewInvitationsCount, setHasNewInvitationsCount] =
    useState<number>(0);

  useEffect(() => {
    const updateNewInvitationsCount = async () => {
      const count = await hasNewInvitations();
      setHasNewInvitationsCount(count);
    };

    updateNewInvitationsCount();
  }, [filtreActif]);

  const handleInputClick = () => {
    setIsDropdownOpen(true);
  };

  const filteredUsers = listUsers.filter((user) =>
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleFiltre = (type: FilterType) => {
    setFiltreActif(type);
    window.location.hash = type;
  };

  const contenuFiltre: { [key in FilterType]: JSX.Element } = {
    tous: <AllFriends />,
    invitations: <Invitations />,
    blocked: <Blocked />,
  };

  useEffect(() => {
    const hash = window.location.hash.substr(1) as FilterType;
    if (hash && ["tous", "invitations", "blocked"].includes(hash)) {
      setFiltreActif(hash);
    }
  }, []);

  const handleUserSelection = async (selectedUser: { id: number }) => {
    setCheckedItems({ [selectedUser.id]: selectedUser });
    try {
      const response = await axios.post(
        `/friends-list/friend-request/${selectedUser.id}`
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleUserHover = (userId: number | null) => {
    setHoveredUser(userId);
  };

  return (
    <div className="flex flex-row h-[80vh]">
      {/*NAV FRIENDS*/}
      <div
        className="w-[260px] md:rounded-l-lg bg-violet-black"
        ref={dropdownRef}
      >
        <div className="p-4">
          <h1
            className="font-outline-2 mt-6 m-2 text-white"
            style={{ cursor: "default" }}
          >
            Friends
          </h1>

          <div className="relative m-2">
            <div className="flex items-center relative">
              <input
                type="text"
                placeholder="Add Friends"
                className={`text-xs placeholder-lilac py-2 pl-9 pr-2 w-full mt-4 focus:outline-none focus:border-fushia ${
                  isDropdownOpen
                    ? "bg-lilac text-white rounded-t-lg"
                    : "bg-accent-violet rounded-md text-lilac"
                }`}
                onClick={handleInputClick}
                onChange={handleInputChange}
                value={searchText}
              />
              <span className="absolute inset-y-0 left-0 pl-3 pt-3.5 flex items-center">
                {isTyping || isDropdownOpen ? (
                  <FaArrowTurnUp className="text-accent-violet mt-1 w-3 h-3 transform rotate-90" />
                ) : (
                  <FaUserPlus className="text-lilac w-4 h-4" />
                )}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="h-34 overflow-auto w-full bg-accent-violet absolute rounded-b-lg py-2">
                {filteredUsers.length === 0 ? (
                  <div className="pl-4">
                    <p className="text-xs font-regular text-lilac">
                      Nothing Found.
                    </p>
                  </div>
                ) : (
                  <div>
                    {filteredUsers.map((user, index) => (
                      <div
                        key={index}
                        style={{ cursor: "pointer" }}
                        className={`flex flex-row justify-between items-center py-1 ${
                          hoveredUser === user.id ? "opacity-100" : "opacity-40"
                        }`}
                        onClick={() => handleUserSelection(user)}
                        onMouseEnter={() => handleUserHover(user.id)}
                        onMouseLeave={() => handleUserHover(null)}
                      >
                        <div className="flex items-center mx-2">
                          <div className="w-[20px] h-[20px] bg-purple border border-lilac rounded-full grid justify-items-center items-center">
                            <FaUser className="w-[8px] h-[8px] text-lilac" />
                          </div>
                          <p className="text-xs font-regular ml-2 text-lilac ">
                            {user.username}
                          </p>
                        </div>
                        <FaUserPlus className="text-lilac w-3 h-3 mr-4" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <nav>
          <ul className="ml-6" style={{ cursor: "pointer" }}>
            <li
              className={`mb-2 text-sm text-lilac hover:bg-purple hover:bg-opacity-10 rounded-l-md ${
                filtreActif === "tous"
                  ? "bg-violet-black-nav py-2 pl-4 rounded-l-md"
                  : "py-2 pl-4"
              }`}
              onClick={() => handleFiltre("tous")}
            >
              Friends
            </li>
            <li
              className={`mb-2 relative text-sm text-lilac hover:bg-purple hover:bg-opacity-10 rounded-l-md ${
                filtreActif === "invitations"
                  ? "bg-violet-black-nav py-2 pl-4 rounded-l-md" // Assurez-vous que cette classe relative est présente
                  : "py-2 pl-4"
              }`}
              onClick={() => handleFiltre("invitations")}
            >
              Invitations
              {hasNewInvitationsCount > 0 && (
                <div className="absolute top-0 right-0 mt-1 mr-2">
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-orange rounded-full flex items-center justify-center">
                    <span className="text-white text-xss font-semibold">
                      {hasNewInvitationsCount}
                    </span>
                  </div>
                </div>
              )}
            </li>
            <li
              className={`mb-2 text-sm text-lilac hover:bg-purple hover:bg-opacity-10 rounded-l-md ${
                filtreActif === "blocked"
                  ? "bg-violet-black-nav py-2 pl-4 rounded-l-md"
                  : "py-2 pl-4"
              }`}
              onClick={() => handleFiltre("blocked")}
            >
              Blocked
            </li>
          </ul>
        </nav>
      </div>

      {/*NAV FRIENDS*/}
      <div className="flex-1 bg-black bg-opacity-70 p-4 md:rounded-r-lg">
        {contenuFiltre[filtreActif]}
      </div>
    </div>
  );
};

export default SetFriends;
