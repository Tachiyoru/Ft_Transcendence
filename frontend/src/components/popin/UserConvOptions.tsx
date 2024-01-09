import { useEffect, useRef, useState } from 'react';
import { FaRegPenToSquare, FaUser } from 'react-icons/fa6';
import { SlOptions } from 'react-icons/sl';
import { RiGamepadFill } from 'react-icons/ri';
import { LuBadgePlus } from "react-icons/lu";
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import { setSelectedChannelId } from '../../services/selectedChannelSlice';
import { useDispatch } from 'react-redux';
import { FaMinusCircle } from 'react-icons/fa';

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
	username: string;
	id: number;
}

const UserConvOptions: React.FC<ChannelProps> = ({ channel, username, id }) => {
	const [popinOpen, setPopinOpen] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);
    const opMembers = channel.members.filter((members) => channel.op.includes(members.username));
	const dispatch = useDispatch();
	const [isBlocked, setIsBlocked] = useState<boolean>(false);

	const togglePopin = () => {
		setPopinOpen(!popinOpen);
	};

	const handleAddOp = () => {
		const socket = io('http://localhost:5001/', {
			withCredentials: true,
		});
		console.log('ok')
		socket.emit('addOp', { chanName: channel.name, username: username });
	};

	const handleRemoveOp = () => {
		const socket = io('http://localhost:5001/', {
			withCredentials: true,
		});
		console.log('okk')
		socket.emit('removeOp', { chanName: channel.name, username: username });
	};


	const handleClick = () => {
	if (opMembers.find(opMember => opMember.username === username)) {
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

	const handleClickSendMessage = () => {
		const socket = io('http://localhost:5001/', {
			withCredentials: true,
		});
		console.log(username)
		socket.emit('getOrCreateChatChannel', { username2: username, id: id }); 
		socket.on('chatChannelCreated', (data) => {
			console.log('Chat channel created:', data);
			dispatch(setSelectedChannelId(data.channelId));
		});
	}

	const handleClickBan = () => {
		const socket = io('http://localhost:5001/', {
			withCredentials: true,
		});
		socket.emit('banUser', { chanId: channel.chanId, username: username }); 
		socket.on('userBanned', (data) => {
			console.log('Ban', data);
		});
	}

	const handleClickKick = () => {
		const socket = io('http://localhost:5001/', {
			withCredentials: true,
		});
		socket.emit('kickUser', { chanId: channel.chanId, username: username }); 
		socket.on('userKicked', (data) => {
			console.log('Kick', data);
		});
	}

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
					<Link to={`/user/${username}`}>
						<div className="flex flex-row items-center pb-1">
							<FaUser size={10}/>
							<p className="ml-2">See profile</p>
						</div>
					</Link>
					<div
						style={{ cursor: "pointer" }} 
						className="flex flex-row items-center pb-1"
						onClick={handleClickSendMessage}
					>
						<FaRegPenToSquare size={11}/>
						<p className="ml-2">Send a message</p>
					</div>
					<div className="flex flex-row items-center pb-1">
						<RiGamepadFill size={11}/>
						<p className="ml-2">Invite to play</p>
					</div>

					{username !== channel.owner.username && (
					<>
					<div className='border-t border-lilac my-2 w-2/3 m-auto border-opacity-50'></div>
					
					<div className="grid grid-cols-2 gap-2">
						<div className="flex flex-row items-center">
							<FaUser size={10} />
							<p className="ml-2">Mute</p>
						</div>
						<div
							style={{ cursor: "pointer" }} 
							onClick={handleClickKick}
							className="flex flex-row items-center"
						>
							<FaRegPenToSquare size={11} />
							<p className="ml-2">Kick</p>
						</div>
						<div className="flex flex-row items-center">
							<FaMinusCircle size={11} />
							<p className={`ml-2 hover:underline ${isBlocked ? 'text-red-500' : ''}`}>{isBlocked ? 'Unblock' : 'Block'}</p>
						</div>
						<div 
							style={{ cursor: "pointer" }} 
							onClick={handleClickBan}
							className="flex flex-row items-center"
						>
							<RiGamepadFill size={11} />
							<p className="ml-2">Ban</p>
						</div>
					</div>
					

					{username !== channel.owner.username && (
						<div>
							<div className='border-t border-lilac my-2 w-2/3 m-auto border-opacity-50'></div>
							<div className="flex flex-row items-center cursor-pointer" onClick={handleClick}>
								<LuBadgePlus size={11} />
								{opMembers.find(opMember => opMember.username === username) ? (
									<p className="ml-2 text-red-orange">Remove</p>
								) : (
									<p className="ml-2">Add from admin</p>
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