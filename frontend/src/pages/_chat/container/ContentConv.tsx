import { ChangeEvent, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaPaperPlane, FaUserGroup } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { RootState } from "../../../store/store";
import TimeConverter from "../../../components/date/TimeConverter";
import AddUserConv from "../../../components/popin/AddUserConv";
import SidebarRightMobile from "./SidebarRightMobile";
import ChannelOptions from "../../../components/popin/ChannelOptions";
import axios from "../../../axios/api";

interface Channel {
	name: string;
	modes: string;
}

interface Message {
	content: string;
	authorId: string,
	createdAt: Date,
}

const ContentConv = () => {
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
	const [channel, setChannel] = useState<Channel | null>(null);
	const [messageList, setMessageList] = useState<Message[]>([]);
	const [message, setMessage] = useState<string>('');

	const id = useSelector((state: RootState) => state.selectedChannelId); // Supposons que c'est là où se trouve votre selectedChannelId

	const handleInputSubmit = (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!channel)
			return;
		const socket = io('http://localhost:5001/', {
			withCredentials: true,
		});
		socket.on('connect', () => {
			socket.emit('create-message', { content: message, chanName: channel.name});
			setMessage('');

		});
		return () => {
			socket.disconnect();
		};
	};

	useEffect(() => {
		const socket = io('http://localhost:5001/', {
			withCredentials: true,
		});
		socket.on('connect', () => {
			socket.emit('channel', {id : id.selectedChannelId});
			socket.on('channel', (channelInfo, messageList) => {
				setMessageList(messageList);
				setChannel(channelInfo);
			});
			socket.on('recapMessages', (newMessage: Message) => {
				setMessageList((prevMessages) => [...prevMessages, newMessage]);
			});
		});

		return () => {
			socket.disconnect();
		};
	}, [id]);

	const toggleRightSidebar = () => {
		setIsRightSidebarOpen(!isRightSidebarOpen);
	};

	return (
	<div className="flex-1 flex flex-col justify-between bg-filter bg-opacity-60 text-xs relative p-8">

		{!channel ? (
		<div className="flex-1 flex flex-col justify-between text-xs relative">
			No conversation selected
		</div>
		):(
		<div className="flex-1 flex flex-col justify-between text-xs">
		<div>
			<div className="flex flex-row justify-between items-center relative">
				<h3 className="text-base text-lilac">{channel.name}</h3>
				<div className="flex-end flex">
					{channel.modes !== 'CHAT' && (
						<div className="flex flex-row">
							<AddUserConv channel={channel.name}/>
							<ChannelOptions channel={channel}/>
						</div>
					)}
					<button className="lg:hidden" onClick={toggleRightSidebar}>
						<FaUserGroup className="w-4 h-4 text-lilac"/>
					</button>
				</div>
			</div>

			{/*CONTENT*/}
			{messageList.map((message, index) => (
			<div key={index} className="flex flex-row h-12 mt-6">
				<div className="w-[45px] h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center mr-4">
					<FaUser className="text-lilac"/>
				</div>
				<div className="pt-3">
					<p className="text-base text-lilac">{message.authorId}</p>
					<div className="flex flex-row">
						<p className="text-sm pt-1 text-lilac text-opacity-60 mr-2">{message.content}</p>
						<TimeConverter initialDate={message.createdAt.toLocaleString()}/>
					</div>
				</div>
			</div>
			))}
			</div>

			{/*SEND*/}
			<div>
				<div className="flex items-center relative">
					<form onSubmit={handleInputSubmit} className="bg-lilac w-full rounded-md">
					<input
						type="text"
						placeholder="Write message"
						className="py-2 pl-2 bg-lilac placeholder:text-white w-full rounded-md"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button type="submit" className="absolute right-4 top-2">
						<FaPaperPlane className="w-3 h-3 text-violet-dark"/>
					</button>
					</form>
				</div>
			</div>

			<SidebarRightMobile isRightSidebarOpen={isRightSidebarOpen} toggleRightSidebar={toggleRightSidebar} channel={channel}/>
		</div>
		)}
		</div>
	)
}

export default ContentConv
