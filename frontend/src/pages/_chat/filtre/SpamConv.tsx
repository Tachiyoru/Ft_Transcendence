import { useContext, useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa6'
import { useDispatch } from 'react-redux';
import { setSelectedChannelId } from '../../../services/selectedChannelSlice';
import axios from '../../../axios/api';
import { WebSocketContext } from '../../../socket/socket';

interface Channel {
	name: string;
	modes: string;
	chanId: number;
	owner: User;
}

interface User {
	id: number;
	username: string;
	avatar: string;
}
const SpamConv = () => {
	const [allChannel, setAllChannel] = useState<Channel[]>([]);
	const [allNoFriends, setNoFriends] = useState<User[]>([]);
	const dispatch = useDispatch();
	const socket = useContext(WebSocketContext);

	const handleChannelClick = (channelId: number) => {
		dispatch(setSelectedChannelId(channelId));
	};

	useEffect(() => {	
		socket.emit("find-my-channels");
		socket.on("my-channel-list", (channelList) => {
			setAllChannel(channelList);
		});
		axios.get<User[]>('friends-list/non-friends')
		.then((response) => {
			setNoFriends(response.data);
		})
		.catch((error) => {
			console.error('Erreur lors de la récupération des non-amis:', error);
		});

		return () => {
			socket.off("my-channel-list");
		};
	}, []);

	console.log(allNoFriends)

	return (
		<div>
			{/* USER */}
			{allChannel
			.filter(channel => channel.modes === "CHAT" && allNoFriends.map(user => user.id).includes(channel.owner.id))
			.map((channel, index) => (
				<div
				key={index}
				className="flex flex-row h-12 mt-2 md:mx-2"
				onClick={() => handleChannelClick(channel.chanId)}
				style={{ cursor: "pointer" }}
				>
				<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
					<FaUser className="text-lilac" />
				</div>
				<div className="pt-3 hidden md:block">
					<div className="flex flex-row justify-between">
					<p className="text-base text-lilac">
						{channel.name.length > 12
						? `${channel.name.slice(0, 12)}...`
						: channel.name}
					</p>
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
		</div>
		);
}

export default SpamConv