import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaPaperPlane, FaUserGroup } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import TimeConverter from "../../../components/date/TimeConverter";
import AddUserConv from "../../../components/popin/AddUserConv";
import SidebarRightMobile from "./SidebarRightMobile";
import ChannelOptions from "../../../components/popin/ChannelOptions";
import { WebSocketContext } from "../../../socket/socket";
import axios from "../../../axios/api";

interface Channel {
  name: string;
  modes: string;
  chanId: number;
  owner: Owner;
  members: Member[];
  op: string[];
}

interface Owner {
  username: string;
  avatar: string;
  id: number;
}

interface Member {
  username: string;
  avatar: string;
  id: number;
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
  const [userData, setUserData] = useState<{ username: string }>({
    username: "",
  });
  const messageContainerRef = useRef(null);
  const [isTyping, setIsTyping] = useState<string>("");
  const [isTypingBool, setIsTypingBool] = useState<boolean>(false);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await axios.get("/users/me");
        setUserData(userDataResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const id = useSelector((state: RootState) => state.selectedChannelId);

  const handleInputSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!channel) return;
    socket.emit("create-message", { content: message, chanName: channel.name });
    console.log("message = ", message);
    setMessage("");
    setIsTypingBool(false);
  };

  useEffect(() => {
    socket.emit("channel", { id: id.selectedChannelId });
    const handleChannelAndMessages = (channelInfo, messageList) => {
      setChannel(channelInfo);
      setMessageList(messageList);
    };
    socket.on("channel", handleChannelAndMessages);
    socket.on("recapMessages", (newMessage: Message) => {
      setMessageList((prevMessages) => [...prevMessages, newMessage]);
      console.log("newMessage = ", newMessage);
    });

    return () => {
      socket.off("channel", handleChannelAndMessages);
      socket.off("recapMessages");
    };
  }, [id, handleInputSubmit]);

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const handleTyping = (e) => {
    const typedMessage = e.target.value;
    setMessage(typedMessage);
    socket.emit("typing", true);
    socket.on("typing", (data) => {
      if (!isTypingBool) {
        setIsTyping(data.name);
        setIsTypingBool(true);
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-filter text-xs relative p-8">
      {!channel ? (
        <div className="flex-1 flex flex-col justify-between text-xs text-lilac relative">
          No conversation selected
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between text-xs">
          <div>
            <div className="flex flex-row justify-between items-center relative mt-4">
              {channel.modes === "CHAT" ? (
                <h3 className="text-base text-lilac">
                  {
                    channel.members.filter(
                      (member) => member.username !== userData.username
                    )[0].username
                  }
                </h3>
              ) : (
                <h3 className="text-base text-lilac">{channel.name}</h3>
              )}
              <div className="flex-end flex">
                {channel.modes !== "CHAT" && (
                  <div className="flex flex-row">
                    <AddUserConv channel={channel} />
                    <ChannelOptions channel={channel} />
                  </div>
                )}
                <button className="lg:hidden" onClick={toggleRightSidebar}>
                  <FaUserGroup className="w-4 h-4 text-lilac" />
                </button>
              </div>
            </div>

            <div className="border border-t-lilac border-opacity-40 mt-6"></div>

            {/* CONTENT */}
            <div
              className="h-[60vh] overflow-auto scrollbar-thin scrollbar-thumb-lilac scrollbar-track-dark-filter "
              ref={messageContainerRef}
            >
              {messageList.map((message, index) => (
                <div key={index} className="flex flex-row h-12 mt-6 mr-2">
                  <div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center mr-4">
                    <FaUser className="text-lilac w-3 h-3" />
                  </div>
                  <div className="pt-3 flex-1">
                    <p className="text-base text-lilac">{message.authorId}</p>
                    <div className="flex flex-row justify-between">
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
          </div>

          {/* SEND */}
          <div>
            <div className="text-lilac italic">{isTyping} is typing...</div>
            <div className="flex items-center relative">
              <form
                onSubmit={handleInputSubmit}
                className="bg-dark-violet w-full rounded-md"
              >
                <input
                  type="text"
                  placeholder="Write message"
                  className="py-2 pl-4 bg-dark-violet text-lilac outline-none placeholder:text-lilac w-full rounded-md"
                  value={message}
                  onChange={handleTyping}
                />
                <button type="submit" className="absolute right-2 top-2">
                  <FaPaperPlane className="w-3.5 h-3.5 text-purple" />
                </button>
              </form>
            </div>
          </div>

          <SidebarRightMobile
            isRightSidebarOpen={isRightSidebarOpen}
            toggleRightSidebar={toggleRightSidebar}
            channel={channel}
          />
        </div>
      )}
    </div>
  );
};

export default ContentConv;
