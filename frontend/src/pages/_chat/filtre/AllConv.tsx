import { useContext, useEffect, useState } from "react";
import { FaUser, FaUserGroup } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setSelectedChannelId, setPrevChannelId} from "../../../services/selectedChannelSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import axios from "../../../axios/api";
import { RiGamepadFill } from "react-icons/ri";
import { WebSocketContext } from "../../../socket/socket";
import { Message } from "react-hook-form";
import TimeConverter from "../../../components/date/TimeConverter";

interface Member {
    username: string;
	avatar: string;
	id: number;
	status: string;
}


interface Message {
	content: string;
	createdAt: string;
	authorId: string;
}

interface Owner {
	username: string;
	avatar: string;
	id: number;
}

interface Channel {
	name: string;
	modes: string;
	chanId: number;
	owner: Owner;
	members: Member[];
	op: string[];
	messages: Message[];
}

interface User {
	username: string;
	avatar: string;
	id: number;
	status: string;
}

const AllConv = () => {
	const [allChannel, setAllChannel] = useState<Channel[]>([]);
	const dispatch = useDispatch();
	const socket = useContext(WebSocketContext);
	const id = useSelector((state: RootState) => state.selectedChannelId);
	const [userData, setUserData] = useState<{username: string}>({ username: '' });
	const [allNoFriends, setNoFriends] = useState<User[]>([]);

	useEffect(() => {
		const fetchData = async () => {
		try {
			const userDataResponse = await axios.get('/users/me');
			setUserData(userDataResponse.data);
		} catch (error) {
			console.error('Error fetching user data:', error);
		}

		axios.get<User[]>('friends-list/non-friends')
		.then((response) => {
			setNoFriends(response.data);
		})
		.catch((error) => {
			console.error('Erreur lors de la récupération des non-amis:', error);
		});

		};
		fetchData();
	}, []);

	useEffect(() => {
		socket.emit("find-my-channels");
		socket.on("my-channel-list", (channelList) => {
		setAllChannel(channelList);
		});

		return () => {
		socket.off("my-channel-list");
		};
	}, [allChannel, socket]);

	useEffect(() => {
		socket.emit("last-message", allChannel);
		socket.on("last-channel-mesage", (channelList) => {
		setAllChannel(channelList);
    });

	return () => {
		socket.off("my-channel-list");
	};
	}, [allChannel, socket]);
	
	const handleChannelClick = (channelId: number) => {
	if (id.selectedChannelId !== null)
		dispatch(setPrevChannelId(id.selectedChannelId))
	dispatch(setSelectedChannelId(channelId));
	};

	const renderLastMessage = (channel: Channel) => {
		if (channel.messages.length > 0) {
		const lastMessage = channel.messages[channel.messages.length - 1];
		const chanName = (lastMessage.authorId === userData.username) ? 'me' :  lastMessage.authorId;
		return (
			<>
				
				<p className="text-sm pt-1 text-lilac text-opacity-60">
					{(chanName.length + lastMessage.content.length) > 16
					? (chanName + ': ' + lastMessage.content).slice(0, 16) + "..."
					: chanName + ': ' + lastMessage.content}
				</p>
				<TimeConverter initialDate={lastMessage.createdAt.toLocaleString()} />
			</>
		);
		} else {
		return (
			<p className="text-sm pt-1 text-lilac text-opacity-60">No messages</p>
		);
		}
	};

	return (
	<div className="pl-1 md:pl-5">
		
	{allChannel
	.filter(channel => !allNoFriends.map(user => user.id).includes(channel.owner.id))
	.map((channel, index) => (
		<div
		key={index}
		className={` ${
			channel.chanId === id.selectedChannelId ? 'bg-filter rounded-l-md pb-1' : 'pb-1'
		}`}
		onClick={() => handleChannelClick(channel.chanId)}
		style={{ cursor: "pointer" }}
		>
		<div className="flex flex-row h-12 mb-2.5 pl-1 pr-2 md:pl-0.5 md:pr-0 md:mx-2 ">
		{channel.modes === "CHAT" ? (
			<div className="relative mt-2 h-full rounded-full grid justify-items-center items-center md:mr-4">
					{channel.members.filter(member => member.username !== userData.username) && channel.members.filter(member => member.username !== userData.username)[0].avatar ? (
					<div>
						<img
							src={channel.members.filter(member => member.username !== userData.username)[0].avatar}
							className="h-[48px] w-[48px] object-cover rounded-full text-lilac"
						/>
					</div>			
					) : (
						<div className="relative w-full h-full md:w-[45px] md:h-[45px] bg-purple rounded-full grid justify-items-center items-center">
							<FaUser className="text-lilac" />
						</div>
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
					<FaUserGroup className="text-lilac w-5 h-5" />
				</div>
			)
			}
			<div className="pt-3 hidden md:block">
				<div className="flex flex-row justify-between items-center">
				<p className="text-base text-lilac">
				{/*CHAN NAME*/}
				{channel.modes === "CHAT" ? (
					channel.members.filter(member => member.username !== userData.username)[0].username
				) : channel.name.length > 10 ? 
					`${channel.name.slice(0, 10)}...` : channel.name
				}
				</p>
				{/*CHAN PROPERTY*/}
				{channel.modes === "PRIVATE" ? (
					<p className="text-xs text-lilac text-opacity-60 ml-4">Private</p>
				) : channel.modes === "GROUPCHAT" ? (
					<p className="text-xs text-lilac text-opacity-60 ml-4">Public</p>
				) : channel.modes === "PROTECTED" ? (
					<p className="text-xs text-lilac text-opacity-60 ml-4">Protected</p>
				) 
				: null}
				</div>
				{/*LAST MESSAGE*/}
				<div className="flex flex-row justify-between w-[140px]">
					{renderLastMessage(channel)}
				</div>
			</div>
			</div>
		</div>
	))}

    </div>
	);
};

export default AllConv;
