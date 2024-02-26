import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import MemberAvatar from "../photo/MemberAvatar";
import { WebSocketContext } from "../../socket/socket";
import axios from "../../axios/api";

interface Member {
  username: string;
  avatar: string;
  id: number;
}

interface Owner {
  username: string;
  avatar: string;
  id: number;
}

interface ChannelProps {
  channel: {
    members: Member[];
    modes: string;
    chanId: number;
    name: string;
    owner: Owner;
    op: string[];
  };
}

const ChannelSettings: React.FC<ChannelProps> = ({ channel }) => {
  const [popinOpen, setPopinOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const opMembers = channel.members.filter((member) =>
    channel.op.includes(member.username)
  );
  const [channelType, setChannelType] = useState<
    "GROUPCHAT" | "PRIVATE" | "PROTECTED"
  >(
    channel.modes === "GROUPCHAT"
      ? "GROUPCHAT"
      : channel.modes === "PRIVATE"
      ? "PRIVATE"
      : "PROTECTED"
  );
  const [password, setPassword] = useState("");
  const [channelName, setChannelName] = useState("");
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
    };
    fetchData();
  }, []);
  const togglePopin = () => {
    setPopinOpen(!popinOpen);
  };

  const handleChangeChannelType = (e: ChangeEvent<HTMLSelectElement>) => {
    setChannelType(e.target.value as "GROUPCHAT" | "PRIVATE" | "PROTECTED");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setPopinOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const editChannel = () => {
    const chanelId = channel.chanId;

    socket.emit("editChannel", {
      id: chanelId,
      updatedSettings: {
        mode: channelType,
        password: channelType === "PROTECTED" ? password : undefined,
      },
    });
  };

  const handleSubmit = () => {
      socket.emit("renameChan", {
        chanId: channel.chanId,
        newName: channelName,
      });
      socket.on("renameChanError", (errorData) => {
        console.log("laaaaaaaaaaaaaaaaaaaaaaaaaaaa CLEMENTINE");
      });
	  return() => {
		  socket.off("renameChanError");
	  }
  };

  return (
    <div className="flex items-center justify-center">
      <button
        className="pr-4 flex flex-row text-lilac items-center"
        onClick={togglePopin}
      >
        <MdSettings className="w-4 h-5 mr-2" />
        Settings
      </button>
      {popinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={cardRef}
            className="bg-dark-violet text-lilac rounded-lg p-8 w-2/3 h-auto relative"
          >
            <span
              className="absolute text-lilac top-6 right-6 cursor-pointer"
              onClick={togglePopin}
            >
              X
            </span>
            <h2 className="text-xl text-lilac font-semibold">
              Channel parameters
            </h2>
            <p className="pt-2">
              Manage channel members and their account permissions here.
            </p>

            <div className="mt-6 flex flex-row">
              <div className="w-40 border-y border-l rounded-l-md p-4">
                <h3 className="mb-4 text-base font-semibold">Owner</h3>
                <p>
                  Owner can add and remove admins and can manage channel's
                  settings
                </p>
              </div>
              <div className="w-full border rounded-r-md p-6">
                <div className="flex flex-col w-[45px] items-center">
                  <MemberAvatar avatar={channel.owner.avatar} />
                  <p className="mt-1">{channel.owner.username}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-row">
              <div className="w-40 border-y border-l rounded-l-md p-4">
                <h3 className="mb-4 text-base font-semibold">Admins</h3>
                <p>
                  Admins can add and remove administrators except the channel
                  owner
                </p>
              </div>
              <div className="w-full border rounded-r-md p-6">
                {opMembers.length > 0 ? (
                  <div className="flex flex-col w-[45px] items-center">
                    {opMembers.map((opMember, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <MemberAvatar avatar={opMember.avatar} />
                        <p className="mt-1">{opMember.username}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No administrator defined in this channel.</p>
                )}
              </div>
            </div>
            {userData.username === channel.owner.username && (
              <>
                <div className="flex flex-col mt-4">
                  <div className="flex flex-row items-center">
                    <label className="text-sm mr-3">Channel Type:</label>
                    <select
                      value={channelType}
                      onChange={handleChangeChannelType}
                      className="rounded-md px-1 text-sm bg-lilac text-accent-violet"
                    >
                      <option value="GROUPCHAT">Public</option>
                      <option value="PRIVATE">Private</option>
                      <option value="PROTECTED">Protected</option>
                    </select>
                    {channelType === "PROTECTED" && (
                      <div className="mr-3 mt-1">
                        <input
                          type="password"
                          placeholder="Enter password"
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded-md w-[90px] px-2 py-1 text-sm bg-lilac placeholder:text-accent-violet focus:bg-lilac text-accent-violet"
                        />
                      </div>
                    )}
                    <button
                      onClick={editChannel}
                      className="ml-3 mt-2 w-[90px] bg-purple text-lilac px-3 py-1 rounded-md"
                    >
                      Edit Channel
                    </button>
                  </div>
                </div>

                <div className="flex flex-row items-center mt-2">
                  <p className="text-sm pr-2">Channel Name:</p>
                  <input
                    type="text"
                    placeholder={channel.name}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="rounded-md w-24 px-2 bg-lilac text-dark-violet placeholder:text-accent-violet text-sm placeholder:text-opacity-40 "
                  />
                  <button
                    disabled={channelName.length === 0}
                    className="ml-2 w-[90px] bg-purple text-lilac px-3 py-1 rounded-md"
                    onClick={handleSubmit}
                  >
                    Change Name
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelSettings;
