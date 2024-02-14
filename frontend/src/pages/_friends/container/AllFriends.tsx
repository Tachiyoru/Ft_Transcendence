import { useContext, useEffect, useRef, useState } from "react";
import {
  FaBan,
  FaGamepad,
  FaMessage,
  FaRegPenToSquare,
  FaUser,
  FaUserMinus,
  FaXmark,
} from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";
import axios from "../../../axios/api";
import { FaMinusCircle } from "react-icons/fa";
import { RiGamepadFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { WebSocketContext } from "../../../socket/socket";
import { setSelectedChannelId } from "../../../services/selectedChannelSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  setListUsersNotFriend,
  setListUsersPending,
} from "../../../services/friendSlice";

const AllFriends = () => {
  const [listUsers, setListUsers] = useState<
    { id: number; username: string; avatar: string }[]
  >([]);
  const listUsersPending = useSelector(
    (state: RootState) => state.friend.listUsersPending
  );
  const [pendinglist, setPendingList] = useState<
    { id: number; username: string; avatar: string }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [previousUserId, setPreviousUserId] = useState<number | null>(null);
  const socket = useContext(WebSocketContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePopinPending = (userId: number) => {
    if (selectedUserId === userId || previousUserId === userId) {
      setSelectedUserId(null);
      setMenuRef(null);
      setPreviousUserId(null);
    } else {
      setSelectedUserId(userId);
      const popinElement = document.getElementById(
        `popin-${userId}`
      ) as HTMLDivElement;
      setMenuRef(popinElement);
      setPreviousUserId(userId);
    }
  };

  const [menuRef, setMenuRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      listUsersPending.forEach((user) => {
        const popinElement = document.getElementById(`popin-${user.id}`);
        if (popinElement && !popinElement.contains(e.target as Node)) {
          setSelectedUserId(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response2 = await axios.get<{ id: number; username: string }[]>(
          "/friends-list/my-pending-list"
        );
        const a2 = response2.data;
        console.log(" myYYYYYYlist pending", a2);
        const response = await axios.get<{ id: number; username: string }[]>(
          "/friends-list/mine"
        );
        const a = response.data;
        setListUsers(a);
        let updateListUsersPending;
        if (a2.length !== listUsersPending.length) {
          updateListUsersPending = listUsersPending.filter(
            (pendingUser) => a2.some((user) => user.id === pendingUser.id)
          );
          console.log("SSSSSSSSSSSS");
        //   dispatch(setListUsersPending(updateListUsersPending));
        } else
          updateListUsersPending = listUsersPending.filter(
            (pendingUser) => !a.some((user) => user.id === pendingUser.id)
			);
		console.log("liiiiiiiiiiist pending",updateListUsersPending);
		dispatch(setListUsersPending(updateListUsersPending));
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    fetchUserData();
  }, []);

  const rejectFriendRequest = async (userId: number) => {
    try {
      await axios.delete(`/friends-list/pending-list/reject/${userId}`);
      const updateListUsersPending = listUsersPending.filter(
        (user) => user.id !== userId
      );
      console.log("list pending", updateListUsersPending);
      dispatch(setListUsersPending(updateListUsersPending));
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const listUsersNotFriend = useSelector(
    (state: RootState) => state.friend.listUsersNotFriend
  );

  const removeFriend = async (user) => {
    try {
      await axios.delete(`/friends-list/remove/${user.id}`);

      const updateListUsers = listUsers.filter((user) => user.id !== user.id);
      setListUsers(updateListUsers);
      const sexe = listUsersNotFriend.filter((User) => User.id !== user.id);
      if (listUsersNotFriend.length === sexe.length) {
        dispatch(setListUsersNotFriend([...listUsersNotFriend, user]));
      }
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  };

  // changer path
  const blockUser = async (userId: number) => {
    try {
      await axios.post(`/friends-list/block/${userId}`);
      const updatedBlockedUsers = listUsers.filter(
        (user) => user.id !== userId
      );
      setListUsers(updatedBlockedUsers);
    } catch (error) {
      console.error("Erreur lors du blocage de l'utilisateur :", error);
    }
  };

  const handleClickSendMessage = (username: string, id: number) => {
    socket.emit("getOrCreateChatChannel", { username2: username, id: id });
    socket.on("chatChannelCreated", (data) => {
      dispatch(setSelectedChannelId(data.channelId));
      navigate("/chat");
    });
  };

  return (
    <div
      className="mt-10 m-4 gap-y-4 flex flex-wrap"
      style={{ cursor: "default" }}
    >
      {/*TEST USER PENDING*/}
      {listUsersPending.map((user, index) => (
        <div
          key={index}
          className="flex flex-col items-center relative px-7 gap-y-2"
        >
          <SlOptions
            size={12}
            className="transform rotate-90 opacity-60 absolute right-3 top-3 text-lilac"
            onClick={() => {
              togglePopinPending(user.id);
            }}
            style={{ cursor: "pointer" }}
          />
          {selectedUserId === user.id && (
            <div
              id={`popin-${user.id}`}
              className="h-18 p-3 overflow-auto w-full bg-accent-violet border border-lilac absolute top-6 right-0 rounded-md"
              style={{ zIndex: 1, cursor: "pointer" }}
            >
              <div
                className="flex flex-row items-center text-lilac text-opacity-60 hover:text-lilac"
                style={{ cursor: "pointer" }}
                onClick={() => rejectFriendRequest(user.id)}
              >
                <FaUserMinus size={12} />
                <p className="text-xs m-1 pl-1">Remove invitation</p>
              </div>
            </div>
          )}

          {user.avatar ? (
            <div>
              <img
                src={user.avatar}
                className="h-[80px] w-[80px] object-cover rounded-full text-lilac border-lilac mt-2"
              />
            </div>
          ) : (
            <div className="w-[80px] h-[80px] bg-purple rounded-full grid justify-items-center items-center mt-2">
              <FaUser className="w-[30px] h-[30px] text-lilac" />
            </div>
          )}
          <p
            className="text-base text-opacity-60 text-lilac pt-1"
            title={user.username}
          >
            {user.username.length > 10
              ? `${user.username.slice(0, 10)}...`
              : user.username}
          </p>
          <p className="text-xs text-lilac opacity-40 italic">Pending...</p>
        </div>
      ))}

      {/* Autres utilisateurs */}
      {listUsers.length === 0 ? (
        <div className="text-center mt-4">
          <p className="text-sm font-regular text-lilac"></p>
        </div>
      ) : (
        listUsers.map((user, index) => (
          <div key={index} className="flex flex-col items-center relative px-7">
            <SlOptions
              size={12}
              className="transform rotate-90 absolute right-3 top-3 text-lilac"
              onClick={() => {
                togglePopinPending(user.id);
              }}
              style={{ cursor: "pointer" }}
            />
            {selectedUserId === user.id && (
              <div
                id={`popin-${user.id}`}
                className="h-18 p-3 text-xs text-lilac text-opacity-60 overflow-auto w-full bg-accent-violet border border-lilac absolute top-6 right-0 rounded-md "
              >
                <Link to={`/user/${user.username}`}>
                  <div
                    className="flex flex-row items-center hover:text-lilac"
                    style={{ cursor: "pointer" }}
                  >
                    <FaUser size={12} />
                    <p className="m-1">See Profile</p>
                  </div>
                </Link>
                <div
                  className="flex flex-row items-center hover:text-lilac"
                  onClick={() => handleClickSendMessage(user.username, user.id)}
                  style={{ cursor: "pointer" }}
                >
                  <FaRegPenToSquare size={12} />
                  <p className="m-1">Send a message</p>
                </div>
                <div
                  className="flex flex-row items-center hover:text-lilac"
                  style={{ cursor: "pointer" }}
                >
                  <RiGamepadFill size={12} />
                  <p className="m-1">Invite to play</p>
                </div>
                <div
                  className="flex flex-row items-center hover:text-lilac"
                  onClick={() => blockUser(user.id)}
                  style={{ cursor: "pointer" }}
                >
                  <FaMinusCircle size={12} />
                  <p className="m-1">Block</p>
                </div>
                <div className="border-b border-b-lilac border-opacity-60 my-2"></div>
                <div
                  className="flex flex-row items-center hover:text-lilac"
                  onClick={() => removeFriend(user)}
                  style={{ cursor: "pointer" }}
                >
                  <FaUserMinus size={12} />
                  <p className="m-1">Delete friend</p>
                </div>
              </div>
            )}
            {user.avatar ? (
              <div>
                <img
                  src={user.avatar}
                  className="h-[80px] w-[80px] object-cover rounded-full text-lilac border-lilac mt-2"
                />
              </div>
            ) : (
              <div className="w-[80px] h-[80px] bg-purple rounded-full grid justify-items-center items-center mt-2">
                <FaUser className="w-[30px] h-[30px] text-lilac" />
              </div>
            )}
            <p
              className="text-base text-opacity-60 text-lilac pt-1"
              title={user.username}
            >
              {user.username.length > 10
                ? `${user.username.slice(0, 10)}...`
                : user.username}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AllFriends;
