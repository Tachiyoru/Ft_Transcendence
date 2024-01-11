import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import {
  FaArrowTurnUp,
  FaMagnifyingGlass,
  FaUser,
  FaUserPlus,
} from "react-icons/fa6";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import { WebSocketContext } from "../../socket/socket";

interface ChannelProps {
  channel: {
    name: string;
    modes: string;
    chanId: number;
  };
}

const AddUserConv: React.FC<ChannelProps> = ({ channel }) => {
  const [isPopinOpen, setIsPopinOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [listUsers, setListUsers] = useState<{ username: string }[]>([]);
  const [checkedItems, setCheckedItems] = useState<{
    [key: string]: { username: string };
  }>({});
  const [searchText, setSearchText] = useState("");
  const socket = useContext(WebSocketContext);

  const handleCheckboxChange = (user: { username: string }) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = { ...prevCheckedItems };
      if (newCheckedItems[user.username]) {
        delete newCheckedItems[user.username];
      } else {
        newCheckedItems[user.username] = user;
      }
      return newCheckedItems;
    });
  };

  //modifier des trucs pour fix les socket qi etaient redefini a chaque changement de page

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        socket.emit("users-not-in-channel", { chanId: channel.chanId }); //need to change to users not in channels and friend with me

        socket.on("users-not-in-channel", (userList) => {
          setListUsers(userList);
        });
        return () => {
          socket.off("users-not-in-channel");
        };
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const inputValue = e.target.value;
    setIsTyping(inputValue !== "");
    setSearchText(inputValue);
  };

  const togglePopin = () => {
    setIsPopinOpen(!isPopinOpen);
  };

  const filteredUsers = listUsers.filter((user) =>
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSubmit = () => {
    const selectedItems = Object.values(checkedItems);
    console.log("Selection:", selectedItems);

    const channelData = {
      chanName: channel.name,
      chanId: channel.chanId,
      targets: selectedItems,
    };
    socket.emit("add-user", { channelData: channelData });

    socket.on("addUsersError", (errorData) => {
      console.error("user creation error:", errorData);
    });

    setCheckedItems({});
    console.log("vide", checkedItems);
    togglePopin();
  };

  return (
    <div>
      <button onClick={togglePopin}>
        <FaUserPlus size={16} className="text-lilac mr-6 mt-1" />
      </button>

      {/*POPIN*/}
      {isPopinOpen && (
        <div
          className="w-[180px] p-4 text-lilac rounded-md bg-accent-violet absolute top-full right-0 mt-1"
          style={{ zIndex: 1 }}
        >
          <p className="text-base mb-1 ">Select Friends</p>
          <p className="text-xs">You can add 5 more friends</p>

          {/*RESEARCH BAR*/}
          <div className="relative">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Research"
                className="text-xs placeholder-accent-violet text-accent-violet pt-1 pb-1 pl-9 w-full my-2 rounded-md bg-lilac focus:outline-none focus:border-fushia"
                onChange={handleInputChange}
                value={searchText}
              />
              <span className="absolute left-0 pl-1 pt-1 items-center">
                {isTyping ? (
                  <FaArrowTurnUp className="text-purple mt-1 w-3 h-3 transform rotate-90 m-2" />
                ) : (
                  <FaMagnifyingGlass className="text-purple w-3 h-3 m-2 mt-1" />
                )}
              </span>
            </div>
          </div>

          {listUsers.length === 0 ? (
            <div className="text-center mt-4">
              <p className="text-sm font-regular">No friends found</p>
              <Link to="/friends">
                <p className="text-xs my-1 underline">
                  Add new friends to your list
                </p>
              </Link>
            </div>
          ) : (
            <div className="h-38 overflow-auto pr-3">
              {filteredUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center mt-2"
                >
                  <div className="flex items-center">
                    <div className="w-[20px] h-[20px] bg-purple rounded-full grid justify-items-center items-center">
                      <FaUser className="w-[8px] h-[8px] text-lilac" />
                    </div>
                    <p className="text-sm font-regular ml-2">{user.username}</p>
                  </div>
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedItems[user.username] !== undefined}
                      style={{ cursor: "pointer" }}
                      onChange={() => handleCheckboxChange(user)}
                      className="h-5 w-5 rounded border border-gray-300 focus:ring-indigo-500 text-indigo-600"
                    />
                  </label>
                </div>
              ))}

              <div className="flex flex-col items-center">
                <button
                  disabled={Object.keys(checkedItems).length === 0}
                  className={`mt-4 px-4 py-1 text-xs rounded-md 
										${
                      Object.keys(checkedItems).length === 0
                        ? "bg-purple opacity-50 text-lilac cursor-not-allowed"
                        : "bg-purple text-lilac cursor-pointer"
                    }`}
                  onClick={handleSubmit}
                >
                  {Object.keys(checkedItems).length === 1 ||
                  Object.keys(checkedItems).length === 0
                    ? "Add people"
                    : "Add peoples"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddUserConv;
