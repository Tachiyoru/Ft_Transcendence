import { FaBan, FaUser, FaUserGroup, FaXmark } from "react-icons/fa6"
import { IoIosArrowForward } from "react-icons/io"
import { RiGamepadFill } from "react-icons/ri"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "../../../axios/api";
import { io } from "socket.io-client";

interface Member {
    username: string;
	avatar: string;
	id: number;
}

interface RightSidebarProps {
	isRightSidebarOpen: boolean;
	toggleRightSidebar: () => void;
	channel: {
		members: Member[];
		modes: string;
		id: number;
		name: string;
	}
}

interface Users {
	username: string;
	avatar: string;
	id: number;
}

interface Channel {
	name: string;
	modes: string;
	chanId: number;
}

const SidebarRightMobile: React.FC<RightSidebarProps> = ({ isRightSidebarOpen, toggleRightSidebar, channel }) => {
	const [isBlocked, setIsBlocked] = useState<boolean>(false);
	const [channelInCommon, setChannelInCommon] = useState<Channel[]>([]);
	const [commonChannelCount, setCommonChannelCount] = useState(0);
	const [usersInChannel, setUsersInChannel] = useState<Users[]>([]);
	const [commonFriendsCount, setCommonFriendsCount] = useState(0);
	const [usersInFriends, setUsersInFriends] = useState<Users[]>([]);
    const [showCommonFriends, setShowCommonFriends] = useState(false);
	const [showCommonChannel, setShowCommonChannel] = useState(false);


    const toggleCommonFriends = () => {
        setShowCommonFriends(!showCommonFriends);
    };

	const toggleCommonChannel = () => {
        setShowCommonChannel(!showCommonChannel);
    };

	useEffect(() => {
		const socket = io('http://localhost:5001/', {
			withCredentials: true,
		});

		socket.emit('users-in-channel', { chanName: channel.name });
		socket.on('users-in-channel', (users) => {
			setUsersInChannel(users);
			console.log(users);
		});
		
		socket.emit('channel-in-common');
		socket.on('channel-in-common', (channelCommon) => {
			setChannelInCommon(channelCommon);
			setCommonChannelCount(channelCommon.length);
		});

		return () => {
			socket.disconnect();
		};
	}, [channel.name]);

	useEffect(() => {
		if (Array.isArray(usersInChannel) && usersInChannel.length > 0 && usersInChannel[0]?.id) {
			axios
			.get(`friends-list/in-common/${usersInChannel[0].id}`)
			.then((response) => {
					setCommonFriendsCount(response.data.length)
					setUsersInFriends(response.data);
				})
			.catch((error) => {
				console.error('Error fetching data:', error);
			});
		}
	}, [usersInChannel]);		

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
            console.error('Erreur lors du blocage ou déblocage de l\'utilisateur :', error);
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
			console.error('Error deblocked users:', error);
		}
	};

	return (
	<div className={`absolute h-[80vh] top-0 right-0 w-[260px] md:rounded-r-lg bg-violet-black p-4 text-gray-300 text-xs ${isRightSidebarOpen ? 'block' : 'hidden'}`}>
			{/*CLOSE*/}
			<button className="lg:hidden flex-end" onClick={toggleRightSidebar}>
				<FaXmark className="w-4 h-4 text-lilac"/>
			</button>

			{channel.modes === 'CHAT' && (
			<div>
				{usersInChannel.map((member, index) => {
                if (member.username !== null) {
                    return (
					<div key={index}>
						<div className="flex flex-col items-center">
						{member.avatar ? (
							<img src={member.avatar} className="h-[86px] w-[86px] object-cover rounded-full text-lilac" alt="User Avatar" />
							) : (
							<div className="bg-purple rounded-full p-2 mt-2">
								<FaUser className="w-[80px] h-[80px] p-3 text-lilac"/>
							</div>
							)}
							<p key={index} className="text-sm text-lilac pt-2">
								{member.username}
							</p>
						</div>
						<nav className="mt-4">
							<ul className="text-lilac">
								<li>
									<Link to={`/user/${member.username}`}>
										<div className="flex flex-row items-center mt-1">
											<FaUser className="w-3 h-4 mr-2"/>
											<p className="hover:underline">See Profile</p>
										</div>
									</Link>
								</li>
								{!isBlocked && (
								<li>
									<Link to="">
										<div className="flex flex-row items-center mt-1">
											<RiGamepadFill className="w-3 h-4 mr-2"/>
											<p className="hover:underline">Invite to play</p>
										</div>
									</Link>
								</li>
								)}
								<li>
									<div className="flex flex-row items-center mt-1" onClick={() => handleBlockUser(member.id)}>
										<FaBan className="w-3 h-4 mr-2"/>
										<p className={`hover:underline ${isBlocked ? 'text-red-500' : ''}`}>{isBlocked ? 'Unblock' : 'Block'}</p>
									</div>
								</li>
			
							</ul>
						</nav>
					</div>
                    );
                }
                return null;
            })}
			

			<div className="flex flex-col justify-end space-y-2 px-2 py-2 mt-4 rounded-lg bg-purple">
				<div onClick={toggleCommonFriends} className="flex flex-row justify-between items-center cursor-pointer">
					<div className="text-xs text-lilac">{commonFriendsCount} common friends</div>
					<IoIosArrowForward className="w-2 h-2 text-lilac"/>
				</div>
				{showCommonFriends && (
					<div>
					{usersInFriends.map((friend) => (
							<div key={friend.id}>
								<Link to={`/user/${friend.username}`} className="text-lilac">
									{friend.username}
								</Link>
							</div>
						))}
					</div>
				)}

				<div className="border-t border-lilac"></div>
					<div onClick={toggleCommonChannel} className="flex flex-row justify-between items-center cursor-pointer">
						<div className="text-xs text-lilac">{commonChannelCount} common channels</div>
						<IoIosArrowForward className="w-2 h-2 text-lilac"/>
					</div>
					{showCommonChannel && (
					<div className="pt-2 text-xs">
					{channelInCommon.map((channel) => (
							<div key={channel.name} className="mb-2">
								<Link to={''} className="text-lilac">
									<div className="flex flex-row justify-between items-center">
										<div className="w-[20px] h-[20px] bg-lilac rounded-full grid justify-items-center items-center">
											<FaUserGroup className="w-6 h-2 text-purple pr-1"/>
										</div>
										<p className="w-full font-regular ml-2">{channel.name}</p>
									</div>
								</Link>
							</div>
						))}
					</div>
				)}
				</div>
				</div>
			)}

				{/*GROUP*/}
				{channel.modes !== 'CHAT' && (
				<div>
					<div className="flex flex-col items-center">
						<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
							<FaUserGroup className="w-[30px] h-[30px] text-lilac"/>
						</div>
						<p className="text-sm text-lilac pt-2">GROUP NAME</p>
						<p className="text-xs text-lilac pt-2">Public - 5 members</p>
					</div>
					<div className="flex flex-col justify-end p-2 mt-4 mx-4 rounded-lg bg-purple">
						<div className="flex flex-row justify-between items-center w-full">
							<div className="text-xs text-lilac">Join group</div>
							<IoIosArrowForward className="w-2 h-2 text-lilac"/>
						</div>
					</div>

					<div className="flex items-center mx-4 mt-4">
						<div className="w-[20px] h-[20px] bg-purple rounded-full grid justify-items-center items-center">
							<FaUser className="w-[8px] h-[8px] text-lilac"/>
						</div>
						<p className='text-xs text-lilac ml-2'>Name</p>
					</div>
					</div>
				)}


		</div>	
	)
}

export default SidebarRightMobile