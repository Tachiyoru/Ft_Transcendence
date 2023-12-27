import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa6';
import { MdSettings } from 'react-icons/md';
import MemberAvatar from '../photo/MemberAvatar';
import { io } from 'socket.io-client';

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
		id: number;
		name: string;
		owner: Owner;
		op: string[]
	}
}

const ChannelSettings: React.FC<ChannelProps> = ({ channel }) => {
	const [popinOpen, setPopinOpen] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);
    const opMembers = channel.members.filter((member) => channel.op.includes(member.username));
	const [channelType, setChannelType] = useState<"public" | "private" | "protected">("public");
	const [password, setPassword] = useState("");
	const [channelName, setChannelName] = useState("");

	const togglePopin = () => {
		setPopinOpen(!popinOpen);
	};

	const handleChangeChannelType = (e: ChangeEvent<HTMLSelectElement>) => {
		setChannelType(e.target.value as "public" | "private");
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

	const handleSubmit = () => {
		try {
			const socket = io("http://localhost:5001/", {
				withCredentials: true,
			});
			socket.on("connect", () => {
				console.log(channelName);
				console.log(channel.name);
				socket.emit("renameChan", { chanName: channel.name, newName: channelName });
		});
		} catch (error) {
		console.error("Error fetching user list:", error);
		}
	};

	return (
	<div className="flex items-center justify-center">
		<button className="pr-4 flex flex-row text-lilac items-center" onClick={togglePopin}>
			<MdSettings className="w-4 h-5 mr-2" />
			Settings
		</button>
		{popinOpen && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
				<div ref={cardRef} className="bg-dark-violet text-lilac rounded-lg p-8 w-2/3 h-auto relative">
					<span className="absolute text-lilac top-6 right-6 cursor-pointer" onClick={togglePopin}>
					X
					</span>
					<h2 className='text-xl text-lilac font-semibold'>Channel parameters</h2>
					<p className='pt-2'>Manage channel members and their account permissions here.</p>

					<div className='mt-6 flex flex-row'>
						<div className='w-40 border-y border-l rounded-l-md p-4'>
							<h3 className='mb-4 text-base font-semibold'>Owner</h3>
							<p>Owner can add and remove users and manage organization-level settings</p>
						</div>
						<div className='w-full border rounded-r-md p-6'>
							<div className='flex flex-col w-[45px] items-center'>
								<MemberAvatar avatar={channel.owner.avatar}/>
								<p className='ml-2'>{channel.owner.username}</p>
							</div>
						</div>
					</div>

				<div className='mt-6 flex flex-row'>
					<div className='w-40 border-y border-l rounded-l-md p-4'>
						<h3 className='mb-4 text-base font-semibold'>Administrators</h3>
						<p>Administrator can add and remove users and manage organization-level settings</p>
					</div>
					<div className='w-full border rounded-r-md p-6'>
					{opMembers.length > 0 ? (
						<div className='flex flex-col w-[45px] items-center'>
							{opMembers.map((opMember) => (
								<div>
									<MemberAvatar avatar={opMember.avatar}/>
									<p className='ml-2'>{opMember.username}</p>
								</div>
							))}
						</div>
						) : (
							<p>No administrator defined in this channel.</p>
					)}
					</div>
				</div>

				<div className="flex flex-col mt-4">
					<div className='flex flex-row'>
						<label className="text-sm mr-3">Channel Type:</label>
						<select
							value={channelType}
							onChange={handleChangeChannelType}
							className="rounded-md px-1 text-sm bg-lilac text-accent-violet"
						>
							<option value="public">Public</option>
							<option value="private">Private</option>
							<option value="protected">Protected</option>
						</select>
					</div>
					{channelType === "protected" && (
					<div className="mr-3 mt-1">
						<input
						type="password"
						placeholder="Enter password"
						onChange={(e) => setPassword(e.target.value)}
						className="rounded-md w-auto px-2 py-1 text-sm bg-lilac placeholder:text-accent-violet text-accent-violet"
						/>
					</div>
					)}
				</div>

				<div className='flex flex-row items-center mt-4'>
					<div className="mr-3 flex flex-row">
						<p className='text-sm mr-2'>Channel Name:</p>
							<input
							type="password"
							placeholder="Change name"
							onChange={(e) => setChannelName(e.target.value)}
							className="rounded-md w-24 px-2 py-0.2 text-sm bg-lilac placeholder:text-accent-violet text-accent-violet"
							/>
					</div>
					<button
						disabled={channelName.length === 0}
						className='px-2 py-0.2 bg-purple text-sm rounded-md'
						onClick={handleSubmit}
						>
							Save Change
					</button>
					</div>
				</div>

			</div>
		)}
		</div>
	);
};

export default ChannelSettings;
