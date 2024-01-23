import React, { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import {
  FaArrowTurnUp,
  FaMagnifyingGlass,
  FaRegPenToSquare,
  FaUser,
} from "react-icons/fa6";
import axios from "../../axios/api";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import { WebSocketContext } from "../../socket/socket";

interface Users {
	username: string;
	avatar: string;
	id: number;
	status: string;
}

const CreateConv: React.FC = () => {
  const [isPopinOpen, setIsPopinOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [listUsers, setListUsers] = useState<{ username: string, avatar: string }[]>([]);
  const [checkedItems, setCheckedItems] = useState<{
    [key: string]: { username: string };
  }>({});
  const [channelType, setChannelType] = useState<
    "public" | "private" | "protected"
  >("public");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [searchText, setSearchText] = useState("");
  const socket = useContext(WebSocketContext);
	const [errorMessage, setErrorMessage] = useState('');

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

  const handleChangeChannelType = (e: ChangeEvent<HTMLSelectElement>) => {
    setChannelType(e.target.value as "public" | "private");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<Users[]>("/users/all");
        setListUsers(response.data);
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
      members: selectedItems,
      mode: "",
      password: "",
      name: ""
    };

    if (Object.keys(checkedItems).length === 1) {
      channelData.mode = "CHAT";
    } else {
      if (channelType === "public") {
        channelData.mode = "GROUPCHAT";
        channelData.name = name;
      } else if (channelType === "private") {
        channelData.mode = "PRIVATE";
        channelData.name = name;
      } else if (channelType === "protected") {
        channelData.mode = "PROTECTED";
        channelData.password = password;
        channelData.name = name;
      }
    }

    if (Object.keys(checkedItems).length > 1 && !name){
        setErrorMessage("Channel name required");
        return;
    }

    console.log("Connected to server");
    socket.emit("createChannel", { settings: channelData })
    
    let isError = false;

    socket.on("channelCreateError", (errorData) => {
      console.error("Channel creation error:", errorData);
      setErrorMessage("Channel name already taken");

      isError = true;
    });
  
    setTimeout(() => {
      if (!isError) {
        setCheckedItems({});
        togglePopin();
        setErrorMessage("");
      }
    }, 2);

  };

  {/*POPIN*/}
	const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        togglePopin();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);

  return (
    <div>
      <button onClick={togglePopin}>
        <FaRegPenToSquare className="mb-1 text-lilac m-2" size={16} />
      </button>

      {/*POPIN*/}
      {isPopinOpen && (
        <div  className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute top-0 inset-0 bg-black bg-opacity-50"></div>
        <div ref={cardRef} className="absolute top-28 left-40 mt-8 z-50 w-[200px] p-4 pl-5 text-lilac rounded-md bg-accent-violet ">
          <p className="text-base mb-1">Select Friends</p>
          <p className="text-xs">You can add 5 more friends</p>

          {/*RESEARCH BAR*/}
          <div className="relative">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Research friends"
                className="text-xs placeholder-accent-violet text-accent-violet pt-1.5 pb-1 pl-9 w-full my-2 rounded-md bg-lilac focus:outline-none focus:border-fushia"
                onChange={handleInputChange}
                value={searchText}
              />
              <span className="absolute left-0 pl-1 pt-1 items-center">
                {isTyping ? (
                  <FaArrowTurnUp className="text-violet-black mt-1 w-3 h-3 transform rotate-90 m-2" />
                ) : (
                  <FaMagnifyingGlass className="text-violet-black w-3 h-3 m-2 mt-1" />
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
                    {user.avatar ?
                      (					
                        <div>
                          <img
                            src={user.avatar}
                            className="h-[20px] w-[20px] object-cover rounded-full text-lilac"
                          />
                        </div>	
                      ) : (
                        <FaUser className="text-lilac w-[8px] h-[8px]"/>
                      )
                      }
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

              {Object.keys(checkedItems).length > 1 && (
                <div className="flex flex-col mt-4">
                  <div>
                    {/*GIVE NAME*/}
                    <label className="text-sm mr-2">Channel Name:</label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        onChange={(e) => setName(e.target.value)}
                        className="rounded w-full px-2 py-1 text-sm bg-lilac placeholder:text-accent-violet text-accent-violet focus:outline-none"
                    />
                    {errorMessage && <div className="text-xs text-red-orange">{errorMessage}</div>}

                    {/*GIVE PROPERTY*/}
                    <label className="text-sm mr-2">Channel Type:</label>
                    <select
                      value={channelType}
                      onChange={handleChangeChannelType}
                      className="rounded px-1 text-sm bg-lilac text-accent-violet focus:outline-none"
                      style={{ cursor: "pointer" }}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="protected">Protected</option>
                    </select>
                    
                    {/*GIVE PASSWORD*/}
                    {channelType === "protected" && (
                      <div className="mr-3 mt-1">
                        <input
                          type="password"
                          placeholder="Enter password"
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded w-full px-2 py-1 text-sm bg-lilac placeholder:text-accent-violet text-accent-violet focus:outline-none"
                        />
                      </div>
                    )}

                  </div>
                </div>
              )}

              <div className="flex flex-col items-center">
                <button
                  disabled={Object.keys(checkedItems).length === 0}
                  className={`mt-4 px-4 py-2 text-sm rounded-md
										${
                      Object.keys(checkedItems).length === 0
                        ? "bg-purple opacity-50 text-lilac cursor-not-allowed"
                        : "bg-purple text-lilac cursor-pointer hover:bg-violet-black"
                    }`}
                  onClick={handleSubmit}
                >
                  {Object.keys(checkedItems).length <= 1
                    ? "Create a conversation"
                    : "Create a channel"}
                </button>
              </div>
            </div>
          )}
          </div>
          </div>
      )}
    </div>
  );
};

export default CreateConv;
