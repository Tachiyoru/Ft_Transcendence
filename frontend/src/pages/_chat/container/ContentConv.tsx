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
	op: string[]
	password: string;
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
	author: Users
}

interface Users {
	username: string;
	avatar: string;
	id: number;
	status: string;
}


const ContentConv = () => {
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
	const [channel, setChannel] = useState<Channel | null>(null);
	const [messageList, setMessageList] = useState<Message[]>([]);
	const [message, setMessage] = useState<string>('');
	const socket = useContext(WebSocketContext);
	const [userData, setUserData] = useState<{username: string; id: number}>({ username: '' });
	const messageContainerRef = useRef(null);
	const [isTyping, setIsTyping] = useState<string>('')
	const [isTypingBool, setIsTypingBool] = useState<boolean>(false);
	const [checkUserInChannel, setCheckUserInChannel] = useState<boolean>(false);
	const [passwordInput, setPasswordInput] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isMuted, setIsMuted] = useState<boolean>(false);
	const [blockedUsers, setBlockedUsers] = useState<{ id: number; username: string;}[]>([]);
	
	useEffect(() => {
		const fetchBlockedUsers = async () => {
		try {
			const response = await axios.get("/friends-list/blocked-users");
			setBlockedUsers(response.data);
		} catch (error) {
			console.error("Error fetching blocked users:", error);
		}
		};

		fetchBlockedUsers();
	}, []);

	const scrollToBottom = () => {
		if (messageContainerRef.current) {
			messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messageList]);

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

	const id = useSelector((state: RootState) => state.selectedChannelId); // Supposons que c'est là où se trouve votre selectedChannelId

	const handleInputSubmit = (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!channel)
			return;
			socket.emit('create-message', { content: message, chanName: channel.name});
			socket.on('recapMessages', (newMessage: Message) => {
				console.log("newMessage = ", newMessage);});
			setMessage('');
			setIsTypingBool(false)
			return () => {
				socket.off('recapMessages');
			};
	};


	const handleJoinChannel = async () => {
		console.log(id.selectedChannelId)
		socket.emit("joinChan", { chanId: id.selectedChannelId, password: passwordInput });
		socket.on("channelJoined", (updatedChannel) => {
			console.log(updatedChannel)
			setCheckUserInChannel(true);
		});
		socket.on("channelJoinedError", (error) => {
			setErrorMessage('Wrong password');
			console.error('Error joining channel:', error);
		});
	};

	useEffect(() => {
			socket.emit('channel', {id : id.selectedChannelId});
			socket.on('channel', (channelInfo, messageList) => {
				setMessageList(messageList);
				setChannel(channelInfo);
			});
			socket.on('recapMessages', (newMessage: Message) => {
				setMessageList((prevMessages) => [...prevMessages, newMessage]);
				setIsTypingBool(false);
			});

			socket.emit("check-user-in-channel", { chanId: id.selectedChannelId });
			socket.on("user-in-channel", (boolean) => {
				setCheckUserInChannel(boolean);
			});

			socket.emit("findAllMutedMembers", { chanId: id.selectedChannelId });
			socket.on("allMuted", (users) => {
			if (users.map((user: Users) => user.id).includes(userData.id))
				setIsMuted(true)
			});

		return () => {
			socket.off('channel');
			socket.off('recapMessages');
		};
	}, [id, socket]);

	const toggleRightSidebar = () => {
		setIsRightSidebarOpen(!isRightSidebarOpen);
	};

	const handleTyping = (e) => {
		const typedMessage = e.target.value;

		setMessage(typedMessage);
		socket.emit('typing', true, );
		socket.on('typing', (data) => {
			if (!isTypingBool)
			{
				setIsTyping(data.name);
				setIsTypingBool(true)
			}
		});
	};

	return (
	<div className="flex-1 flex flex-col justify-between bg-filter text-xs relative p-8">

		{!channel ? (
		<div className="flex-1 flex flex-col justify-between text-xs text-lilac relative">
			No conversation selected
		</div>
		): channel.modes === "PROTECTED" && !checkUserInChannel ? (
			<div className="flex-1 flex flex-col justify-between text-xs text-lilac relative">
				<div>
				<input
					type="password"
					placeholder="Enter password"
					value={passwordInput}
					className="bg-lilac rounded-md text-white placeholder:text-white px-2 py-1"
					onChange={(e) => setPasswordInput(e.target.value)}
				/>
				<button onClick={handleJoinChannel} className="ml-2 px-2 py-1 rounded-md bg-purple">Submit</button>
				{errorMessage && <div className="text-red-orange">{errorMessage}</div>}
				</div>
			</div>
		) : (
		<div className="flex-1 flex flex-col h-full text-xs">
			<div>
				<div className="flex flex-row justify-between items-center relative mt-4">
					{channel.modes === "CHAT" ? (
						<h3 className="text-base text-lilac">{channel.members.filter(member => member.username !== userData.username)[0].username}</h3>) 
					: (
						<h3 className="text-base text-lilac">{channel.name}</h3>
					)}
					<div className="flex-end flex">
						{channel.modes !== 'CHAT' && (
							<div className="flex flex-row">
								<AddUserConv channel={channel}/>
								<ChannelOptions channel={channel}/>
							</div>
						)}
						<button onClick={toggleRightSidebar}>
							<FaUserGroup className="w-4 h-4 text-lilac"/>
						</button>
					</div>
				</div>
				<div className="border border-t-lilac border-opacity-40 mt-6"></div>
			</div>

			{/*CONTENT*/}
			<div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-lilac scrollbar-track-dark-filter " ref={messageContainerRef}>
				{messageList.map((message, index) => (
				<div key={index} className="flex flex-row h-12 mt-6 mr-2">
					<div className="w-full h-full md:w-[44px] md:h-[44px] mt-2 bg-purple rounded-full grid justify-items-center items-center mr-4">
						{message.author.avatar ?
						(					
							<div>
								<img
									src={message.author.avatar}
									className="h-[45px] w-[45px] object-cover rounded-full text-lilac"
								/>
							</div>	
						) : (
							<FaUser className="text-lilac w-3 h-3"/>
						)
						} 
						
					</div>
					<div className="pt-3 flex-1">
						<p className="text-base text-lilac">{message.authorId}</p>
						<div className="flex flex-row justify-between">
							{blockedUsers.map(user => user.username).includes(message.authorId) ? 
								(<p className="text-sm pt-1 text-lilac text-opacity-60 mr-2">Message blocking is</p>)
							:
								(<p className="text-sm pt-1 text-lilac text-opacity-60 mr-2">{message.content}</p>)
							}
							<TimeConverter initialDate={message.createdAt.toLocaleString()}/>
						</div>
					</div>
				</div>
				))}
			</div>

			{/*SEND*/}
			<div className="mt-6">
				<div className="text-lilac italic">{isTyping} is typing...</div>
					<div className="flex items-center relative">
						<form onSubmit={handleInputSubmit} className="bg-dark-violet w-full rounded-md">
						<input
							type="text"
							placeholder={isMuted ? "You are not allowed to send a message in this channel" : "Write message"}
							className={`py-2 pl-4 bg-dark-violet text-lilac outline-none placeholder:text-lilac w-full rounded-md ${isMuted ? 'cursor-not-allowed' : ''}`}
							value={message}
							onChange={handleTyping}
							disabled={isMuted}
							/>
						<button type="submit" className="absolute right-2 top-2">
						{!isMuted && (<FaPaperPlane className="w-3.5 h-3.5 text-purple"/>)}
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