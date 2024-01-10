import { useContext, useEffect, useState } from "react";
import { FaUser, FaUserGroup } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setSelectedChannelId } from "../../../services/selectedChannelSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import axios from "../../../axios/api";
import { RiGamepadFill } from "react-icons/ri";
import { WebSocketContext } from "../../../socket/socket";
import { all } from "axios";
import { Message } from "react-hook-form";
import TimeConverter from "../../../components/date/TimeConverter";

interface Member {
    username: string;
	avatar: string;
	id: number;
	status: string;
}

interface Channel {
	name: string;
	modes: string;
	chanId: number;
	members: Member[];
  messages: Message[];
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
	const id = useSelector((state: RootState) => state.selectedChannelId);
	const [userData, setUserData] = useState<{username: string}>({ username: '' });
	useEffect(() => {
		const fetchData = async () => {
		try {
			const userDataResponse = await axios.get('/users/me');
			setUserData(userDataResponse.data);
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
		};
		fetchData();
	}, []);

  useEffect(() => {
    socket.emit("find-my-channels");
    socket.on("my-channel-list", (channelList) => {
      setAllChannel(channelList);
    });
    console.log(allChannel);

    return () => {
      socket.off("my-channel-list");
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("last-message", allChannel);
    socket.on("last-channel-mesage", (channelList) => {
      setAllChannel(channelList);
    });

    return () => {
      socket.off("my-channel-list");
    };
  }, [socket]);

	const handleChannelClick = (channelId: number) => {
		dispatch(setSelectedChannelId(channelId));
	};

  const renderLastMessage = (channel) => {
    if (channel.messages.length > 0) {
      const lastMessage = channel.messages[channel.messages.length - 1];

      return (
        <>
          <p className="text-sm pt-1 text-lilac text-opacity-60 mr-2">
            {lastMessage.content.length > 16
              ? lastMessage.content.slice(0, 16) + "..."
              : lastMessage.content}
          </p>
          <TimeConverter initialDate={lastMessage.createdAt.toLocaleString()} />
        </>
      );
    } else {
      return (
        <p className="text-sm pt-1 text-lilac text-opacity-60">Aucun message</p>
      );
    }
  };

return (
	<div className="pl-1 md:pl-6">
		
	{allChannel.map((channel, index) => (
		<div
		key={index}
		className={` ${
			channel.chanId === id.selectedChannelId ? 'bg-filter rounded-l-md pb-1' : 'pb-1'
		}`}
		onClick={() => handleChannelClick(channel.chanId)}
		style={{ cursor: "pointer" }}
		>
		<div className="flex flex-row h-12 mb-2 pl-1 pr-2 md:pl-0 md:pr-0 md:mx-2 ">
		{channel.modes === "CHAT" ? (
			<div className="relative w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
					{channel.members.filter(member => member.username !== userData.username) && channel.members.filter(member => member.username !== userData.username)[0].avatar ? (
					<>
						<img
							src={channel.members.filter(member => member.username !== userData.username)[0].avatar}
							className="h-[45px] w-[45px] object-cover rounded-full text-lilac"
						/>
					</>			
					) : (
						<FaUser className="text-lilac" />
					)
				}
			{channel.members.filter(member => member.username !== userData.username) && channel.members.filter(member => member.username !== userData.username)[0].status === 'ONLINE' ? (
				<div className="absolute bg-acid-green w-3 h-3 rounded-full right-0 bottom-0.5"></div>
			) : channel.members.filter(member => member.username !== userData.username) && channel.members.filter(member => member.username !== userData.username)[0].status === 'OFFLINE' ? (
			<div className="absolute bg-red-orange w-3 h-3 rounded-full right-0 bottom-0.5"></div>
			) : 
				<div className="absolute bg-fushia w-3 h-3 rounded-full right-0 bottom-0.5 flex items-center justify-center">
					<RiGamepadFill className="text-white w-2 h-2"/>
				</div>
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
        {renderLastMessage(channel)}
        </p>
			<p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
			</div>
		</div>
		</div>
		</div>
	))}

    </div>
	);
};

export default AllConv;
