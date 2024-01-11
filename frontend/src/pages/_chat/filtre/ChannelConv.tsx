import { useContext, useEffect, useState } from 'react';
import { FaUserGroup } from 'react-icons/fa6'
import { useDispatch } from 'react-redux';
import { setSelectedChannelId } from '../../../services/selectedChannelSlice';
import { WebSocketContext } from '../../../socket/socket';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface Channel {
	name: string;
	modes: string;
	chanId: number;
}

const ChannelConv = () => {
	const [allChannel, setAllChannel] = useState<Channel[]>([]);
	const [publicChannel, setPublicChannel] = useState<Channel[]>([]);
	const dispatch = useDispatch();
	const socket = useContext(WebSocketContext);
	const id = useSelector((state: RootState) => state.selectedChannelId);

	useEffect(() => {

		socket.emit("find-my-channels");
		socket.on("my-channel-list", (channelList) => {
		setAllChannel(channelList);
		});

		socket.emit("find-channels-public-protected");
		socket.on("channel-public-protected-list", (channelList) => {
		setPublicChannel(channelList);
		});

    return () => {
		socket.off("my-channel-list");
		socket.off("channel-public-list");
		};
	}, [socket]);

	const handleChannelClick = (channelId: number) => {
		dispatch(setSelectedChannelId(channelId));
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
				<div className="flex flex-row">
				<p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">
					Lorem ipsum dolor…
				</p>
				<p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
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
				<div className="pt-3 hidden md:block">
					<div className="flex flex-row justify-between">
						<p className="text-base text-lilac">{channel.name.length > 10 ? 
						`${channel.name.slice(0, 10)}...` : channel.name}</p>
						<p className="text-sm text-lilac text-opacity-60">{channel.modes === 'GROUPCHAT' ? 'Public' : ''}</p>
					</div>
					<div className="flex flex-row">
						<p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">Lorem ipsum dolor…</p>
						<p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
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
			<div className="flex flex-row h-12 mb-2.5 pl-1 pr-2 md:pl-0.5 md:pr-0 md:mx-2 ">
				<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
					<FaUserGroup className="text-lilac"/>
				</div>
				<div className="pt-3 hidden md:block">
					<div className="flex flex-row justify-between">
						<p className="text-base text-lilac">{channel.name.length > 10 ? 
						`${channel.name.slice(0, 10)}...` : channel.name}</p>
						<p className="text-sm text-lilac text-opacity-60">{channel.modes === 'GROUPCHAT' ? 'Public' : ''}</p>
					</div>
					<div className="flex flex-row">
						<p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">Lorem ipsum dolor…</p>
						<p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
					</div>
				</div>
			</div>
		</div>
		))}
    </div>
	);
};

export default ChannelConv;
