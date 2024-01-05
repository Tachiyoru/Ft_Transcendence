import { useEffect, useState } from "react";
import {
  FaArrowTurnUp,
  FaMagnifyingGlass,
  FaRegPenToSquare,
} from "react-icons/fa6";
import AllConv from "../filtre/AllConv";
import PersoConv from "../filtre/PersoConv";
import ChannelConv from "../filtre/ChannelConv";
import CreateConv from "../../../components/popin/CreateConv";
import SpamConv from "../filtre/SpamConv";

interface SidebarLeftProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isTyping: boolean;
}

type FilterType = "all" | "personnal" | "channel" | "spam";

const SidebarLeft: React.FC<SidebarLeftProps> = ({
  handleInputChange,
  isTyping,
}) => {
  const [filtreActif, setFiltreActif] = useState<FilterType>("all");

  useEffect(() => {
    const hash = window.location.hash.substr(1) as FilterType;
    if (hash && ["all", "personnal", "channel", "spam"].includes(hash)) {
      setFiltreActif(hash);
    }
  }, []);

  const handleFiltre = (type: FilterType) => {
    setFiltreActif(type);
    window.location.hash = type;
  };

  const contenuFiltre: { [key in FilterType]: JSX.Element } = {
    all: <AllConv />,
    personnal: <PersoConv />,
    channel: <ChannelConv />,
    spam: <SpamConv />,
  };

  return (
    <div className="w-[66px] md:w-[260px] md:rounded-l-lg bg-violet-black p-2 md:p-4 text-gray-300 flex-col space-y-3">
      <div>
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
            />
            <span className="absolute inset-y-0 left-0 pl-3 pt-3 mt-2 items-center hidden md:block">
              {isTyping ? (
                <FaArrowTurnUp className="text-lilac mt-1 w-3.5 h-3.5 transform rotate-90 m-2" />
              ) : (
                <FaMagnifyingGlass className="text-lilac w-3.5 h-3.5 m-2 mt-1" />
              )}
            </span>
          </div>
        </div>
        {/*NAV*/}
        <div className="hidden md:block flex w-full" style={{ cursor: "pointer" }}>
          <ul className="flex flex-row m-2 flex-between">
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
              Direct
            </li>
            <li
              className={`text-sm text-lilac hover:bg-purple hover:bg-opacity-30 ml-1 rounded-md py-1 p-3 
							${filtreActif === "channel" ? "bg-purple" : ""}`}
              onClick={() => handleFiltre("channel")}
            >
              Group
            </li>
            <li
              className={`text-sm text-lilac hover:bg-purple hover:bg-opacity-30 ml-1 rounded-md py-1 p-3 
							${filtreActif === "spam" ? "bg-purple" : ""}`}
              onClick={() => handleFiltre("spam")}
            >
              Spam
            </li>
          </ul>
        </div>
      </div>

	<div className="h-80">
      <div className="flex-1">{contenuFiltre[filtreActif]}</div>
	  </div>
	</div>
  );
};

export default SidebarLeft;
