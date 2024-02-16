import { useContext, useEffect, useState } from 'react';
import { FaUserGroup } from 'react-icons/fa6'
import { useDispatch } from 'react-redux';
import { setPrevChannelId, setSelectedChannelId } from '../../../services/selectedChannelSlice';
import { WebSocketContext } from '../../../socket/socket';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import axios from '../../../axios/api';
import TimeConverter from '../../../components/date/TimeConverter';
import { useNavigate } from 'react-router-dom';

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

interface Channel {
	name: string;
	modes: string;
	chanId: number;
	members: Member[];
	messages: Message[];
	owner: User;
}

interface User {
	username: string;
	avatar: string;
	id: number;
	status: string;
}
const ChannelConv = () => {
	const [allChannel, setAllChannel] = useState<Channel[]>([]);
	const [publicChannel, setPublicChannel] = useState<Channel[]>([]);
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



	useEffect(() => {

		socket.emit("find-channels-public-protected");
		socket.on("channel-public-protected-list", (channelList) => {
		setPublicChannel(channelList);
		});

    return () => {
		socket.off("channel-public-list");
		};
	}, [socket]);

	const navigate = useNavigate();

	const handleChannelClick = (channelId: number) => {
		if (id.selectedChannelId !== null)
			dispatch(setPrevChannelId(id.selectedChannelId))
		dispatch(setSelectedChannelId(channelId));
		navigate(`/chat/${channelId}`)
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
		.filter(channel => channel.modes !== "CHAT")
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
			<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
				<FaUserGroup className="text-lilac" />
			</div>
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
				<div className="flex flex-row justify-between w-[140px]">
					{renderLastMessage(channel)}
				</div>
			</div>
			</div>
			</div>
		))}

		{/*PROTECTED CHANNEL*/}
		<div className='mt-10 mb-4'>
		{publicChannel.filter(channel => channel.modes === "PROTECTED").length > 0 ? (
			<>
				<div className="border-t w-full border-lilac "></div>
				<p className='text-xs text-lilac mt-4 pl-2'>Other protected groups you can join</p>
			</>
		) :
			<>
				<div className="border-t w-full border-lilac "></div>
				<p className='text-xs text-lilac mt-4 pl-2'>No protected channel available at the moment</p>
			</>
		}
		</div>
		{publicChannel
		.filter(channel => channel.modes === "PROTECTED")
		.map((channel, index) => (
		<div 
			key={index}
			onClick={() => handleChannelClick(channel.chanId)}
			className={` ${
				channel.chanId === id.selectedChannelId ? 'bg-filter rounded-l-md pb-1' : 'pb-1'
			}`}
		>
			<div className="flex flex-row h-12 mb-2.5 pl-1 pr-2 md:pl-0.5 md:pr-0 md:mx-2 ">
				<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
					<FaUserGroup className="text-lilac"/>
				</div>
				<div className="pt-3 hidden md:block w-2/3">
					<div className="flex flex-row justify-between">
						<p className="text-base text-lilac">{channel.name.length > 10 ? 
						`${channel.name.slice(0, 10)}...` : channel.name}</p>
						<p className="text-sm text-lilac text-opacity-60">{channel.modes === 'PROTECTED' ? 'Protected' : ''}</p>
					</div>
				</div>
			</div>
		</div>
		))}

		{/*PUBLIC CHANNEL*/}
		<div className='mt-10 mb-4'>
		{publicChannel.filter(channel => channel.modes === "GROUPCHAT").length > 0 ? (
			<>
				<div className="border-t w-full border-lilac "></div>
				<p className='text-xs text-lilac mt-4 pl-2'>Other public groups you can join</p>
			</>
		) :
			<>
				<div className="border-t w-full border-lilac "></div>
				<p className='text-xs text-lilac mt-4 pl-2'>No public channel available at the moment</p>
			</>
		}
		</div>
		{publicChannel
		.filter(channel => channel.modes === "GROUPCHAT")
		.map((channel, index) => (
		<div 
			key={index}
			onClick={() => handleChannelClick(channel.chanId)}
			className={` ${
				channel.chanId === id.selectedChannelId ? 'bg-filter rounded-l-md pb-1' : 'pb-1'
			}`}
		>
			<div className="flex flex-row h-12 mb-2.5 pl-1 pr-2 md:pl-0.5 md:pr-0 md:mx-2">
				<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
					<FaUserGroup className="text-lilac"/>
				</div>
				<div className="pt-3 hidden md:block w-2/3">
					<div className="flex flex-row justify-between">
						<p className="text-base text-lilac">{channel.name.length > 10 ? 
						`${channel.name.slice(0, 10)}...` : channel.name}</p>
						<p className="text-sm text-lilac text-opacity-60">{channel.modes === 'GROUPCHAT' ? 'Public' : ''}</p>
					</div>
				</div>
			</div>
		</div>
		))}
    </div>
	);
};

export default ChannelConv;
