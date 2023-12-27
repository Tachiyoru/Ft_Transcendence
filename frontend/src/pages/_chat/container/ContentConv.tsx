import { ChangeEvent, useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import {
  FaBan,
  FaPaperPlane,
  FaUserGroup,
  FaXmark,
} from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { RiGamepadFill } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import TimeConverter from "../../../components/date/TimeConverter";
import AddUserConv from "../../../components/popin/AddUserConv";
import { WebSocketContext } from "../../../socket/socket";

interface Channel {
  name: string;
  modes: string;
}

interface Message {
  content: string;
  authorId: string;
  createdAt: Date;
}

const ContentConv = () => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const socket = useContext(WebSocketContext);

  const namespace = io("http://localhost:5001/user-${socket.id}");

  const { chanId } = useParams();

  const handleInputSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!channel) return;
    console.log("Connected to server content");
    socket.emit("create-message", {
      content: message,
      chanName: channel.name,
    });
    setMessage("");
  };

  useEffect(() => {

      socket.emit("channel", { id: chanId });
      socket.on("channel", (channelInfo, messageList) => {
        console.log("Received channel:", channelInfo, messageList);
        setMessageList(messageList);
        setChannel(channelInfo);
      });
    console.log("connected as socket :", socket.id);
    socket.on("recapMessages", (newMessage: Message) => {
      console.log(
        "Received new message:",
        newMessage,
        "from socket",
        socket.id
      );
      setMessageList((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
      socket.off("channel");
      socket.off("recapMessages");
    };
  }, [chanId, socket]);

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-dark-violet text-gray-300 text-xs relative p-8">
      {/*NAME*/}
      {!channel ? (
        <div className="flex-1 flex flex-col justify-between bg-dark-violet text-gray-300 text-xs relative">
          No conversation selected
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between bg-dark-violet text-gray-300 text-xs relative">
          <div>
            <div className="flex flex-row justify-between items-center relative">
              <h3 className="text-base text-lilac mt-2">{channel.name}</h3>
              <button
                className="lg:hidden flex-end"
                onClick={toggleRightSidebar}
              >
                <FaUserGroup className="w-4 h-4 text-lilac" />
              </button>
              <AddUserConv channel={channel.name} />
            </div>
            {/*CONTENT*/}
            {messageList.map((message, index) => (
              <div key={index} className="flex flex-row h-12 mt-6">
                <div className="w-[45px] h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center mr-4">
                  <FaUser className="text-lilac" />
                </div>
                <div className="pt-3">
                  <p className="text-base text-lilac">{message.authorId}</p>
                  <div className="flex flex-row">
                    <p className="text-sm pt-1 text-lilac text-opacity-60 mr-2">
                      {message.content}
                    </p>
                    <TimeConverter
                      initialDate={message.createdAt.toLocaleString()}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/*SEND*/}
          <div>
            <div className="flex items-center relative">
              <form
                onSubmit={handleInputSubmit}
                className="bg-lilac w-full rounded-md"
              >
                <input
                  type="text"
                  placeholder="Write message"
                  className="py-2 pl-2 bg-lilac placeholder:text-white w-full rounded-md"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="absolute right-4 top-2">
                  <FaPaperPlane className="w-3 h-3 text-violet-dark" />
                </button>
              </form>
            </div>
          </div>
          <div
            className={`absolute h-[80vh] top-0 right-0 w-[260px] md:rounded-r-lg bg-violet-black p-4 text-gray-300 text-xs ${
              isRightSidebarOpen ? "block" : "hidden"
            }`}
          >
            {/*CLOSE*/}
            <button className="lg:hidden flex-end" onClick={toggleRightSidebar}>
              <FaXmark className="w-4 h-4 text-lilac" />
            </button>

            {/*TEST USER FRIEND*/}
            <div className="flex flex-col items-center">
              <div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
                <FaUser className="w-[30px] h-[30px] text-lilac" />
              </div>
              <p className="text-sm text-lilac pt-2">Name</p>
            </div>

            {/*NAV PERSONNAL CONV*/}
            <nav className="mt-4">
              <ul className="text-lilac">
                <li>
                  <Link to="/settings">
                    <div className="flex flex-row items-center">
                      <FaUser className="w-3 h-4 mr-2" />
                      <p className="hover:underline">See Profile</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/settings">
                    <div className="flex flex-row items-center">
                      <RiGamepadFill className="w-3 h-4 mr-2" />
                      <p className="hover:underline">Invite to play</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/settings">
                    <div className="flex flex-row items-center">
                      <FaBan className="w-3 h-4 mr-2" />
                      <p className="hover:underline">Block</p>
                    </div>
                  </Link>
                </li>
              </ul>
            </nav>

            {/*NAV PERSONNAL CONV*/}
            <div className="flex flex-col justify-end space-y-2 px-2 py-2 mt-4 rounded-lg bg-purple">
              <div className="flex flex-row justify-between items-center">
                <div className="text-xs text-lilac">Invite friends</div>
                <IoIosArrowForward className="w-2 h-2 text-lilac" />
              </div>
              <div className="border-t border-lilac"></div>
              <div className="flex flex-row justify-between items-center">
                <div className="text-xs text-lilac">Random player</div>
                <IoIosArrowForward className="w-2 h-2 text-lilac" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentConv;
