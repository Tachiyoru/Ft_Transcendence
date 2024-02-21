import React, { useContext, useEffect, useRef, useState } from "react";
import { FaArrowTurnUp, FaUser, FaUserPlus } from "react-icons/fa6";
import AllFriends from "./AllFriends";
import Invitations from "./Invitations";
import Blocked from "./Blocked";
import axios from "../../../axios/api";
import { getLoggedInUserInfo } from "../../../components/nav/container/NavHorizontal";
import {
  setListUsersNotFriend,
  setListUsersPending,
} from "../../../services/friendSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { RiTimer2Line } from "react-icons/ri";
import { WebSocketContext } from "../../../socket/socket";

type FilterType = "tous" | "invitations" | "blocked";

interface Users {
  username: string;
  avatar: string;
  id: number;
  status: string;
}

const SetFriends: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [filtreActif, setFiltreActif] = useState<FilterType>("tous");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loadingFriendsList, setLoadingFriendsList] = useState(true);
  const dispatch = useDispatch();
  const listUsersPending = useSelector(
    (state: RootState) => state.friend.listUsersPending
  );
  const listUsersNotFriend = useSelector(
    (state: RootState) => state.friend.listUsersNotFriend
  );
  const socket = useContext(WebSocketContext);

const hasNewInvitations = async () => {
    const { id: userId } = await getLoggedInUserInfo();
    const fetchedPendingList = await getPendingList();
    return fetchedPendingList.length;
  };

  const [hasNewInvitationsCount, setHasNewInvitationsCount] =
    useState<number>(0);

    const updateNewInvitationsCount = async () => {
      const count = await hasNewInvitations();
	  console.log(count);
      setHasNewInvitationsCount(count);
    };
    updateNewInvitationsCount();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<{ id: number; username: string }[]>(
          "/friends-list/non-friends"
				);
				
				// on en fait rien de la non friends list 

				
        setLoadingFriendsList(false);
      } catch (error) {
        console.error("Error fetching user list:", error);
        setLoadingFriendsList(false);
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
        const response = await axios.get<Users[]>("/friends-list/non-friends");
        dispatch(setListUsersNotFriend(response.data));
        const pending = await axios.get<Users[]>(
          "/friends-list/pending-request/"
        );
        dispatch(setListUsersPending(pending.data));
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.substr(1) as FilterType;
    if (hash && ["tous", "invitations", "blocked"].includes(hash)) {
      setFiltreActif(hash);
    }
  }, []);

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setIsTyping(inputValue !== "");
    setSearchText(e.target.value);
  };

  const getPendingList = async () => {
    try {
      const response = await axios.get(`/friends-list/pending-list`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user pending list:", error);
      return [];
    }
  };

  const handleInputClick = () => {
    setIsDropdownOpen(true);
  };

  const filteredUsers = listUsersNotFriend.filter((user) =>
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleFiltre = (type: FilterType) => {
    setFiltreActif(type);
    window.location.hash = type;
  };

  const contenuFiltre: { [key in FilterType]: JSX.Element } = {
    tous: <AllFriends />,
    invitations: <Invitations onAcceptFriendRequest={updateNewInvitationsCount} />,
    blocked: <Blocked />,
  };

  const handleUserSelection = async (selectedUser: Users) => {
    try {
      await axios.post(`/friends-list/friend-request/${selectedUser.id}`);
      dispatch(setListUsersPending([...listUsersPending, selectedUser]));
      socket.emit("all-update");
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
      <div className="w-[260px] md:rounded-l-lg bg-violet-black">
        <div className="p-4">
          <h1
            className="font-outline-2 mt-6 m-2 text-white"
            style={{ cursor: "default" }}
          >
            Friends
          </h1>

          <div ref={dropdownRef} className="relative m-2">
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
              <div
                className="h-34 overflow-auto w-full bg-accent-violet absolute rounded-b-lg py-2"
                style={{ zIndex: 1 }}
              >
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
                        style={{
                          cursor: !listUsersPending.find(
                            (pending) => pending.id === user.id
                          )
                            ? "pointer"
                            : "not-allowed",
                        }}
                        className={`flex flex-row justify-between items-center py-1 ${
                          hoveredUser === user.id ? "opacity-100" : "opacity-40"
                        }`}
                        onClick={() => {
                          if (
                            !listUsersPending.find(
                              (pending) => pending.id === user.id
                            )
                          )
                            handleUserSelection(user);
                        }}
                        onMouseEnter={() => handleUserHover(user.id)}
                        onMouseLeave={() => handleUserHover(null)}
                      >
                        <div className="flex items-center mx-2">
                          {user.avatar ? (
                            <div>
                              <img
                                src={user.avatar}
                                className="h-[20px] w-[20px] object-cover rounded-full text-lilac border-lilac"
                              />
                            </div>
                          ) : (
                            <div className="w-[20px] h-[20px] bg-purple border border-lilac rounded-full grid justify-items-center items-center">
                              <FaUser className="w-[8px] h-[8px] text-lilac" />
                            </div>
                          )}
                          <p className="text-xs font-regular ml-2 text-lilac ">
                            {user.username}
                          </p>
                        </div>
                        {!listUsersPending.find(
                          (pending) => pending.id === user.id
                        ) ? (
                          <FaUserPlus className="text-lilac w-3 h-3 mr-4" />
                        ) : (
                          <RiTimer2Line className="text-lilac w-3 h-3 mr-4" />
                        )}
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
                  ? "bg-violet-black-nav py-2 pl-4 rounded-l-md"
                  : "py-2 pl-4"
              }`}
              onClick={() => handleFiltre("invitations")}
            >
              Invitations
              {hasNewInvitationsCount > 0 && (
                <div className="absolute top-2.5 left-20  w-3 h-3 bg-red-orange rounded-full flex items-center justify-center">
                  <span className="text-white text-xss font-semibold">
                    {hasNewInvitationsCount}
                  </span>
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
