import { ChangeEvent, useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaPaperPlane, FaUserGroup } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { RootState } from "../../../store/store";
import TimeConverter from "../../../components/date/TimeConverter";
import AddUserConv from "../../../components/popin/AddUserConv";
import SidebarRightMobile from "./SidebarRightMobile";
import ChannelOptions from "../../../components/popin/ChannelOptions";
import { set } from "react-hook-form";
import { WebSocketContext } from "../../../socket/socket";

interface Channel {
	name: string;
	modes: string;
	chanId: number;
	owner: Owner;
	members: Member[];
	op: string[]
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
	authorId: string,
	createdAt: Date,
}

const ContentConv = () => {
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
	const [channel, setChannel] = useState<Channel | null>(null);
	const [messageList, setMessageList] = useState<Message[]>([]);
	const [message, setMessage] = useState<string>('');
	const socket = useContext(WebSocketContext);

	const id = useSelector((state: RootState) => state.selectedChannelId); // Supposons que c'est là où se trouve votre selectedChannelId

	const handleInputSubmit = (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!channel)
			return;
			socket.emit('create-message', { content: message, chanName: channel.name});
			socket.on('recapMessages', (newMessage: Message) => {
				console.log("newMessage = ", newMessage);});
			console.log("messagelist la = ", messageList);
			setMessage('');
			return () => {
				socket.off('recapMessages');
			};
	};

	useEffect(() => {
			socket.emit('channel', {id : id.selectedChannelId});
			socket.on('channel', (channelInfo, messageList) => {
				console.log(channelInfo);
				setMessageList(messageList);
				setChannel(channelInfo);
			});
			socket.on('recapMessages', (newMessage: Message) => {
				setMessageList((prevMessages) => [...prevMessages, newMessage]);
			});
			console.log("messagelist la2 = ", messageList);

		return () => {
			socket.off('channel');
			socket.off('recapMessages');
		};
	}, [id]);

	const toggleRightSidebar = () => {
		setIsRightSidebarOpen(!isRightSidebarOpen);
	};

	const handleTyping = (e) => {
		const typedMessage = e.target.value;
	
		// Mettez à jour l'état du message
		setMessage(typedMessage);
		let typing = true;
		// Émettez l'événement 'typing' avec le message tapé
		socket.emit('typing', typing, );
		socket.on('typing', (data) => {
			console.log("typing = ", data);
		});
	  };

	return (
	<div className="flex-1 flex flex-col justify-between bg-filter text-xs relative p-8">

		{!channel ? (
		<div className="flex-1 flex flex-col justify-between text-xs relative">
			No conversation selected
		</div>
		):(
		<div className="flex-1 flex flex-col justify-between text-xs">
		<div>
			<div className="flex flex-row justify-between items-center relative mt-4">
				<h3 className="text-base text-lilac">{channel.name}</h3>
				<div className="flex-end flex">
					{channel.modes !== 'CHAT' && (
						<div className="flex flex-row">
							<AddUserConv channel={channel}/>
							<ChannelOptions channel={channel}/>
						</div>
					)}
					<button className="lg:hidden" onClick={toggleRightSidebar}>
						<FaUserGroup className="w-4 h-4 text-lilac"/>
					</button>
				</div>
			</div>

			<div className="border border-t-lilac border-opacity-40 mt-6"></div>

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
					<form onSubmit={handleInputSubmit} className="bg-dark-violet w-full rounded-md">
					<input
						type="text"
						placeholder="Write message"
						className="py-2 pl-4 bg-dark-violet placeholder:text-lilac w-full rounded-md"
						value={message}
						onChange={handleTyping}
					/>
					<button type="submit" className="absolute right-2 top-2">
						<FaPaperPlane className="w-3.5 h-3.5 text-purple"/>
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