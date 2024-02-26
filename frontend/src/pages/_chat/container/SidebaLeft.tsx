import { useContext, useEffect, useRef, useState } from "react";
import {
  FaArrowTurnUp,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import AllConv from "../filtre/AllConv";
import PersoConv from "../filtre/PersoConv";
import ChannelConv from "../filtre/ChannelConv";
import CreateConv from "../../../components/popin/CreateConv";
import { WebSocketContext } from "../../../socket/socket";
import axios from "../../../axios/api";

type FilterType = "all" | "personnal" | "channel";

interface Member {
  username: string;
}
interface Channel {
  name: string;
  modes: string;
  members: Member[];
}

const SidebarLeft = () => {
  const [allChannels, setAllChannels] = useState<Channel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPopin, setShowPopin] = useState(false);
  const [filtreActif, setFiltreActif] = useState<FilterType>("all");
  const [actuReceived, setActuReceived] = useState<boolean>(false);
  const socket = useContext(WebSocketContext);
  const [userData, setUserData] = useState<{ username: string }>({
    username: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await axios.get("/users/me");
        setUserData(userDataResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.substr(1) as FilterType;
    if (hash && ["all", "personnal", "channel"].includes(hash)) {
      setFiltreActif(hash);
    }
    setActuReceived(false);
  }, [actuReceived]);

  const handleFiltre = (type: FilterType) => {
    setFiltreActif(type);
    window.location.hash = type;
  };

  const contenuFiltre: { [key in FilterType]: JSX.Element } = {
    all: <AllConv />,
    personnal: <PersoConv />,
    channel: <ChannelConv />,
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsTyping(value.length > 0);
    setShowPopin(value.length > 0);
  };

  const handleInputFocus = () => {
    setShowPopin(true);
    setSearchTerm('');
  };

  useEffect(() => {
    socket.emit("find-my-channels");
    socket.on("my-channel-list", (channelList) => {
      setAllChannels(channelList);
    });
  }, [socket]);

  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowPopin(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);

  const filteredChannels = allChannels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-[66px] md:w-[260px] md:rounded-l-lg bg-violet-black space-y-3 ">
      <div className="px-2 md:px-4 pt-4 pb-0.5">
        {/*TITLE*/}
        <div className="relative flex flex-col md:flex-row justify-between items-center mt-6">
          <h1 className="hidden md:block font-outline-2 text-white m-2">
            Chat
          </h1>
          <CreateConv />
        </div>
        {/*RESEARCH BAR*/}
        <div className="relative">
          <div className="flex items-center">
            <input
              
              type="text"
              placeholder="Search"
              className="text-xs m-2 placeholder-lilac text-lilac py-2 pl-10 pr-2 w-full mt-4 rounded-md bg-accent-violet focus:outline-none focus:border-fushia hidden md:block"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
            <span className="absolute inset-y-0 left-0 pl-3 pt-3 mt-2 items-center hidden md:block">
              {isTyping ? (
                <FaArrowTurnUp className="text-lilac mt-1 w-3.5 h-3.5 transform rotate-90 m-2" />
              ) : (
                <FaMagnifyingGlass className="text-lilac w-3.5 h-3.5 m-2 mt-1" />
              )}
            </span>
            {showPopin && (
              <div ref={cardRef} className="absolute rounded-b m-2 top-3 left-0 right-0 bg-lilac text-dark-violet shadow-md mt-8">
                <ul>
                  {filteredChannels.map((channel, index) => (
                    <li key={index} className="text-xs py-1 px-4 hover:bg-accent-violet hover:text-lilac">
                    {channel.modes === 'CHAT' ? (
                      channel.members
                        .filter((member) => member.username !== userData.username)
                        .map((filteredMember, memberIndex) => (
                          <span key={memberIndex}>{filteredMember.username}</span>
                        ))
                    ) : (
                      channel.name
                    )}
                  </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {/*NAV*/}
        <div className="hidden md:block flex w-full" style={{ cursor: "pointer" }}>
          <ul className="flex flex-row m-2 justify-between">
            <li
              className={`text-sm text-lilac ${
                filtreActif === "all"
                  ? "bg-purple py-1 p-3 rounded-md"
                  : "py-1 p-3"
              }`}
              onClick={() => handleFiltre("all")}
            >
              All
            </li>
            <li
              className={`text-sm text-lilac hover:bg-purple hover:bg-opacity-30 ml-1 rounded-md py-1 p-3 
							${filtreActif === "personnal" ? "bg-purple" : ""}`}
              onClick={() => handleFiltre("personnal")}
            >
              Personnal
            </li>
            <li
              className={`text-sm text-lilac hover:bg-purple hover:bg-opacity-30 ml-1 rounded-md py-1 p-3 
							${filtreActif === "channel" ? "bg-purple" : ""}`}
              onClick={() => handleFiltre("channel")}
            >
              Group
            </li>
          </ul>
        </div>
      </div>

    <div className="h-[60vh] overflow-auto scrollbar-thin scrollbar-thumb-lilac scrollbar-track-dark-filter">
        <div>{contenuFiltre[filtreActif]}</div>
    </div>
	</div>
  );
};

export default SidebarLeft;
