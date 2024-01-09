import { useContext, useEffect, useState } from "react";
import { FaUser, FaUserGroup } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setSelectedChannelId } from "../../../services/selectedChannelSlice";
import { WebSocketContext } from "../../../socket/socket";

interface Channel {
  name: string;
  modes: string;
  chanId: number;
}

interface User {
	username: string;
	avatar: string;
}

const AllConv = () => {
	const [allChannel, setAllChannel] = useState<Channel[]>([]);
	const [usersInChannelExceptHim, setUsersInChannelExceptHim] = useState<{ [idchan: number]: User[] }>({});
	const dispatch = useDispatch();
	const socket = useContext(WebSocketContext);

	useEffect(() => {
		socket.emit("find-my-channels");
		socket.on("my-channel-list", (channelList) => {
		setAllChannel(channelList);
		});

    return () => {
      socket.off("my-channel-list");
    };
  }, [socket]);

  const handleChannelClick = (channelId: number) => {
    dispatch(setSelectedChannelId(channelId));
  };

  return (
    <div>
      {/*USER*/}
      {allChannel.map((channel, index) => (
        <div
          key={index}
          className="flex flex-row h-12 mt-2 md:mx-2"
          onClick={() => handleChannelClick(channel.chanId)}
          style={{ cursor: "pointer" }}
        >
		{channel.modes === "CHAT" ? (
			<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
				{usersInChannelExceptHim[channel.chanId] && usersInChannelExceptHim[channel.chanId].length > 0 ? (
					<>
						<img
							src={usersInChannelExceptHim[channel.chanId][0].avatar}
							className="h-12 w-14 object-cover rounded-full text-lilac"
						/>
					</>			
					) : (
						<FaUser className="text-lilac" />
					)
				}
			</div>
		) : (
			<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
				<FaUserGroup className="text-lilac" />
			</div>
		)
		}
          <div className="pt-3 hidden md:block">
            <div className="flex flex-row justify-between">
              <p className="text-base text-lilac">
                {channel.name.length > 12
                  ? `${channel.name.slice(0, 12)}...`
                  : channel.name}
              </p>
              {channel.modes === "PRIVATE" ? (
                <p className="text-sm text-lilac text-opacity-60">Private</p>
              ) : channel.modes === "GROUPCHAT" ? (
                <p className="text-sm text-lilac text-opacity-60">Public</p>
              ) : channel.modes === "PROTECTED" ? (
				<p className="text-sm text-lilac text-opacity-60">Protected</p>
			  ) 
			  : null}
            </div>
            <div className="flex flex-row">
              <p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">
                Lorem ipsum dolor…
              </p>
              <p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
            </div>
          </div>
        </div>
      ))}

      {/*CHANNEL
		<div className="flex flex-row h-12 md:m-2">
		<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
				<FaUserGroup className="text-lilac"/>
			</div>
			<div className="pt-3 hidden md:block">
				<div className="flex flex-row justify-between">
					<p className="text-base text-lilac">Channel</p>
					<p className="text-sm text-lilac text-opacity-60">Public</p>
				</div>
				<div className="flex flex-row">
					<p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">Lorem ipsum dolor…</p>
					<p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
				</div>
			</div>
		</div>*/}
    </div>
  );
};

export default AllConv;
