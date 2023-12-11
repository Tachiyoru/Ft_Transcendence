import { useEffect, useState } from 'react';
import { FaUser, FaUserGroup } from 'react-icons/fa6'
import { io } from 'socket.io-client';

interface Channel {
	name: string;
	modes: string;
}

const AllConv = () => {
	const [allChannel, setAllChannel] = useState<Channel[]>([]);

	useEffect(() => {
		const socket = io('http://localhost:5001/', {
			withCredentials: true,
		});

		socket.on('connect', () => {
			console.log('Connected to server');
			socket.emit('findAllChannels');

			socket.on('channelList', (channelList) => {
			console.log('Received channel list:', channelList);
			setAllChannel(channelList);
			});
		});

		return () => {
			socket.disconnect();
		};
	},[]);


	return (
	<div>
		{/*USER*/}
		{allChannel.map((channel, index) => (
		<div key={index} className="flex flex-row h-12 mt-2 md:mx-2">
			<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
				<FaUser className="text-lilac"/>
			</div>
			<div className="pt-3 hidden md:block">
			<div className="flex flex-row justify-between">
				<p className="text-base text-lilac">{channel.name.length > 12 ? `${channel.name.slice(0, 12)}...` : channel.name}</p>
					{channel.modes === 'PROTECTED' ? (
					<p className="text-sm text-lilac text-opacity-60">Private</p>
					) : channel.modes === 'GROUPCHAT' ? (
					<p className="text-sm text-lilac text-opacity-60">Public</p>
					) : null}
				</div>
				<div className="flex flex-row">
					<p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">Lorem ipsum dolor…</p>
					<p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
				</div>
			</div>
		</div>
		))}

		{/*CHANNEL
		<div className="flex flex-row h-12 md:m-2">
		<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
				<FaUserGroup className="text-lilac"/>
			</div>
			<div className="pt-3 hidden md:block">
				<div className="flex flex-row justify-between">
					<p className="text-base text-lilac">Channel</p>
					<p className="text-sm text-lilac text-opacity-60">Public</p>
				</div>
				<div className="flex flex-row">
					<p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">Lorem ipsum dolor…</p>
					<p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
				</div>
			</div>
		</div>*/}
	</div>
	)
}

export default AllConv