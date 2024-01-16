import { useContext, useEffect, useRef, useState } from 'react';
import { FaRegPenToSquare, FaUser, FaVolumeXmark } from 'react-icons/fa6';
import { SlOptions } from 'react-icons/sl';
import { RiGamepadFill } from 'react-icons/ri';
import { LuBadgePlus } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { setSelectedChannelId, setUsersBan, setUsersInChannel, setUsersNotInChannel } from '../../services/selectedChannelSlice';
import { useDispatch } from 'react-redux';
import { FaMinusCircle } from 'react-icons/fa';
import { WebSocketContext } from '../../socket/socket';
import 	axios from '../../axios/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

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
	}
	user: Users,
	onMuteUser: (mutedUserId: number, user: Users) => void;
}

interface Users {
	username: string;
	avatar: string;
	id: number;
	status: string;
}

const UserConvOptions: React.FC<ChannelProps> = ({ channel, user, onMuteUser }) => {
	const [popinOpen, setPopinOpen] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);
    const opMembers = channel.members.filter((members) => channel.op.includes(members.username));
	const dispatch = useDispatch();
	const [isBlocked, setIsBlocked] = useState<boolean>(false);
	const [isMuted, setIsMuted] = useState<boolean>(false);
	const socket = useContext(WebSocketContext);
	const [userData, setUserData] = useState<{username: string}>({ username: '' });
	const usersInChannel = useSelector((state: RootState) => state.selectedChannelId.channelUsers[channel.chanId]);
	const usersNotInChannel = useSelector((state: RootState) => state.selectedChannelId.usersNotInChannel[channel.chanId]);
	const usersBan = useSelector((state: RootState) => state.selectedChannelId.channelBannedUsers[channel.chanId]);

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

	const togglePopin = () => {
		setPopinOpen(!popinOpen);
	};

	const handleAddOp = () => {
		socket.emit('addOp', { chanId: channel.chanId, username: user.username });
		setPopinOpen(!popinOpen);
	};

	const handleRemoveOp = () => {
		socket.emit('removeOp', { chanId: channel.chanId, username: user.username });
		setPopinOpen(!popinOpen);
	};

	const handleClick = () => {
	if (opMembers.find(opMember => opMember.username === user.username)) {
		handleRemoveOp();
	} else {
		handleAddOp();
		}
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

	useEffect(() => {
		axios
		.get(`friends-list/blocked-users/${user.id}`)
		.then((response) => {
			setIsBlocked(response.data.isBlocked);
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
		});

		socket.emit("findAllMutedMembers", { chanId: channel.chanId });
		socket.on("allMuted", (users) => {
		if (users.map((user: Users) => user.id).includes(user.id))
			setIsMuted(true)
		});
	}, [user.id, socket]);

	const handleClickSendMessage = () => {
		socket.emit('getOrCreateChatChannel', { username2: user.username, id: user.id }); 
		socket.on('chatChannelCreated', (data) => {
			console.log('Chat channel created:', data);
			dispatch(setSelectedChannelId(data.channelId));
		});
	}

	const handleClickBan = () => {
		socket.emit('banUser', { chanId: channel.chanId, username: user.username }); 
		socket.on('userBanned', (data) => {
			console.log('Ban', data);
			const updatedUsers = usersInChannel.filter((users: Users) => users.id !== user.id);
			dispatch(setUsersInChannel({channelId: channel.chanId, users:updatedUsers}));
			dispatch(setUsersBan({channelId: channel.chanId, users: [...usersBan, user]}));
			const updatedUsersNotInChannel = usersNotInChannel.filter(users => users.id !== user.id);
			dispatch(setUsersNotInChannel({channelId: channel.chanId, users: updatedUsersNotInChannel}));	
			console.log(usersBan)
		});
		setPopinOpen(!popinOpen);
	}

	const handleClickKick = () => {
		socket.emit('kickUser', { chanId: channel.chanId, username: user.username }); 
		socket.on('userKicked', (data) => {
			console.log('Kick', data);
			const updatedUsers = usersInChannel.filter(users => users.id !== user.id);
			dispatch(setUsersInChannel({channelId: channel.chanId, users:updatedUsers}));
			const updatedUsersNotInChannel = usersNotInChannel.filter(users => users.id !== user.id);
			dispatch(setUsersNotInChannel({channelId: channel.chanId, users: updatedUsersNotInChannel}));			
		});
		setPopinOpen(!popinOpen);
	}

	{/*MUTE FUNCTIONS*/}
	const handleClickMute = async () => {
		try {
			if (isMuted) {
				await unMuteUser();
				setIsMuted(false);
				onMuteUser(user.id, user);
			} else {
				await muteUser();
				setIsMuted(true);
				onMuteUser(user.id, user);
			}
		} catch (error) {
			console.error('Erreur lors du blocage:', error);
		}
		setPopinOpen(!popinOpen);
	}

	const unMuteUser = async () => {
		socket.emit("unMuteMember", { chanId: channel.chanId, userId: user.id });
		socket.on("memberUnMuted", (users) => {
			console.log("unMute", users);
		})
	};

	const muteUser = async () => {
		socket.emit("muteMember", { chanId: channel.chanId, userId: user.id });
		socket.on("memberMuted", (users) => {
			console.log("Mute", users);
		});

	};

	const handleBlockUser = async (userId: number) => {
		try {
			if (isBlocked) {
				await unblockUser(userId);
				setIsBlocked(false);

			} else {
				await blockUser(userId);
				setIsBlocked(true);
			}
		} catch (error) {
			console.error('Erreur lors du blocage:', error);
		}
	};

	const blockUser = async (userId: number) => {
		try {
			await axios.post(`/friends-list/block/${userId}`);
		} catch (error) {
			console.error('Erreur lors du blocage de l\'utilisateur :', error);
		}
	};

	const unblockUser = async (userId: number) => {
		try {
		await axios.post(`/friends-list/unblock/${userId}`);
		} catch (error) {
		console.error("Error deblocked users:", error);
		}
	};

	return (
	<div>
		<button
		className="flex flex-row text-lilac items-center"
		onClick={togglePopin}
		>
		<SlOptions className="w-3 h-3"/>
		</button>
		{popinOpen && (
		<div className="">
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"></div>
			<div ref={cardRef} className="absolute top-4 right-0 z-50">
				<div className="bg-dark-violet text-lilac rounded-lg px-6 py-5">
					<Link to={`/user/${user.username}`}>
						<div className="flex flex-row items-center pb-1 hover:opacity-40">
							<FaUser size={10}/>
							<p className="ml-2">See profile</p>
						</div>
					</Link>
					<div
						style={{ cursor: "pointer" }} 
						className="flex flex-row items-center pb-1 hover:opacity-40"
						onClick={handleClickSendMessage}
					>
						<FaRegPenToSquare size={11}/>
						<p className="ml-2">Send a message</p>
					</div>
					<div
						style={{ cursor: "pointer" }}
						className="flex flex-row items-center pb-1 hover:opacity-40"
					>
						<RiGamepadFill size={11}/>
						<p className="ml-2">Invite to play</p>
					</div>

					{(user.username !== channel.owner.username || opMembers.find(opMember => opMember.username === userData.username))  && (
					<>
					<div className='border-t border-lilac my-2 w-2/3 m-auto border-opacity-50'></div>
					
					<div className="grid grid-cols-2 gap-2">
						<div
							style={{ cursor: "pointer" }}
							onClick={handleClickMute}
							className="flex flex-row items-center hover:opacity-40"
						>
							<FaVolumeXmark size={10} />
							<p className={`ml-2 ${isMuted ? 'text-red-500' : ''}`}>{isMuted ? 'Unmute' : 'Mute'}</p>
						</div>
						<div
							style={{ cursor: "pointer" }} 
							onClick={handleClickKick}
							className="flex flex-row items-center hover:opacity-40"
						>
							<FaRegPenToSquare size={11} />
							<p className="ml-2">Kick</p>
						</div>
						<div 
							style={{ cursor: "pointer" }}
							onClick={() => handleBlockUser(user.id)}
							className="flex flex-row items-center hover:opacity-40"
						>
							<FaMinusCircle size={11} />
							<p className={`ml-2 ${isBlocked ? 'text-red-500' : ''}`}>{isBlocked ? 'Unblock' : 'Block'}</p>
						</div>
						<div 
							style={{ cursor: "pointer" }} 
							onClick={handleClickBan}
							className="flex flex-row items-center hover:opacity-40"
						>
							<RiGamepadFill size={11} />
							<p className="ml-2 ">Ban</p>
						</div>
					</div>
					

					{user.username !== channel.owner.username && (
						<div>
							<div className='border-t border-lilac my-2 w-2/3 m-auto border-opacity-50'></div>
							<div className="flex flex-row items-center cursor-pointer" onClick={handleClick}>
								<LuBadgePlus size={11} />
								{opMembers.find(opMember => opMember.username === user.username) ? (
									<p className="ml-2 text-red-orange">Remove</p>
								) : (
									<p className="ml-2">Register as operator</p>
								)}
						</div>
						</div>
					)}
				</>	
				)}
				</div>
			</div>
		</div>
		)}
	</div>
	);
};

export default UserConvOptions;