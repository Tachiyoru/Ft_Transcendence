import React, { ChangeEvent, useEffect, useState } from 'react';
import { FaArrowTurnUp, FaMagnifyingGlass, FaRegPenToSquare, FaUser } from 'react-icons/fa6';
import axios from '../../axios/api';
import io from 'socket.io-client';

const CreateConv: React.FC = () => {
	const [isPopinOpen, setIsPopinOpen] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [listUsers, setListUsers] = useState<string[]>([]);
	const [checkedItems, setCheckedItems] = useState(new Map());

	const handleCheckboxChange = (nom: string) => {
		const newCheckedItems = new Map(checkedItems);
		
		if (newCheckedItems.has(nom)) {
			newCheckedItems.delete(nom);
		} else {
			newCheckedItems.set(nom, true);
		}
		
		setCheckedItems(newCheckedItems);
	};

	useEffect(() => {
	const fetchUserData = async () => {
		try {
			const response = await axios.get<{ username: string }[]>('/users/all');
			console.log(response.data);
			
			const usernamesArray = response.data.map(user => user.username);
			setListUsers(usernamesArray);
			} catch (error) {
			console.error('Error fetching user list:', error);
			}
		};
	fetchUserData();
	}, []);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
			const inputValue = e.target.value;
			setIsTyping(inputValue !== '');
	};

	const togglePopin = () => {
	setIsPopinOpen(!isPopinOpen);
	};

	const handleSubmit = () => {
		const selectedItems = Array.from(checkedItems.keys());
		console.log('Selection:', selectedItems);

		const channelData = {
			name: "salut toi",
			members: selectedItems,
			mode: 'CHAT',
			};
		
		const socket = io('http://localhost:5001/');
	
		socket.on('connect', () => {
		console.log('Connected to server');
	
		socket.emit('createChannel', { settings: channelData });

		socket.on("channelCreateError", (errorData) => {
			console.error("Channel creation error:", errorData);
			});
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from server');
			socket.disconnect();
		});

		checkedItems.clear();
		togglePopin();
	};


	return (
	<div>
		<button onClick={togglePopin}>
			<FaRegPenToSquare className="mb-1 text-lilac m-2" size={16} />
		</button>

		{/*POPIN*/}
		{isPopinOpen && (
		<div className="w-11/12 p-4 text-lilac rounded-md bg-accent-violet absolute top-full right-0 mt-1" style={{ zIndex: 1}}>
			<p className='text-base mb-1'>Select Friends</p>
			<p className='text-xs'>You can add 5 more friends</p>

			{/*RESEARCH BAR*/}
			<div className="relative">
				<div className="flex items-center">
				<input
					type='text'
					placeholder='Research friends'
					className="text-xs placeholder-accent-violet text-accent-violet pt-1.5 pb-1 pl-9 w-full my-2 rounded-md bg-lilac focus:outline-none focus:border-fushia hidden md:block"
					onChange={handleInputChange}
					/>
					<span className="absolute left-0 pl-1 pt-1 items-center">
					{isTyping ? (
						<FaArrowTurnUp className="text-violet-black mt-1 w-3 h-3 transform rotate-90 m-2"/>
					) : (
						<FaMagnifyingGlass className="text-violet-black w-3 h-3 m-2 mt-1"/>
					)}
					</span>
				</div>
			</div>
			
			{/*NO FRIENDS
			<div className='text-center mt-4'>
				<p className='text-sm font-regular'>No friends found</p>
				<Link to="/friends">
					<p className='text-xs my-1 underline'>Add new friends to your list</p>
				</Link>
			</div>*/}

			{/*SELECT USERS*/}
			<div className='h-32 overflow-auto pr-3'>
			{listUsers.map((nom, index) => (
				
				<div key={index} className='flex flex-row justify-between items-center mt-2'>
				<div className="flex items-center">
				<div className="w-[20px] h-[20px] bg-purple rounded-full grid justify-items-center items-center">
					<FaUser className="w-[8px] h-[8px] text-lilac"/>
				</div>
				<p className='text-sm font-regular ml-2'>{nom}</p>
				</div>

				<label className="inline-flex items-center space-x-2 cursor-pointer">
				<input
					type="checkbox"
					checked={checkedItems.has(nom)} // Vérifie si l'élément est coché dans la Map
					onChange={() => handleCheckboxChange(nom)} // Appelle la fonction handleCheckboxChange avec le nom correspondant
					className="h-5 w-5 rounded border border-gray-300 focus:ring-indigo-500 text-indigo-600"
				/>
				</label>
			</div>
			))}
			</div>
			<div className="flex flex-col items-center">
				<button
				disabled={checkedItems.size === 0}
				className={`mt-4 px-4 py-2 text-sm rounded-md 
				${checkedItems.size === 0 ? 'bg-purple opacity-50 text-lilac cursor-not-allowed' : 'bg-purple text-lilac cursor-pointer'}`}
				onClick={handleSubmit}
				>
					{checkedItems.size === 1 || checkedItems.size === 0 ? 'Create a conversation' : 'Create a channel'}
				</button>
			</div>
		</div>
		)}
	</div>
	);
	};

export default CreateConv;
