import { useState } from "react";
import { FaArrowTurnUp, FaUserPlus } from "react-icons/fa6";
import NavVerticalFriends from "./container/NavVerticalFriends";

const FriendsLayout = ({ children, currentPage }) => {
	const [isTyping, setIsTyping] = useState(false);

	const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setIsTyping(inputValue !== '');
    };

	return (
	<div className="flex flex-row h-[80vh]">
	{/*NAV FRIENDS*/}
	<div className="w-[260px] md:rounded-l-lg bg-dark-purple p-4 t">
		<h1 className="font-outline-2 mt-5 m-2 text-white">Friends</h1>
		<div className="relative m-2">
			<div className="flex items-center">
				<input
					type='text'
					placeholder='Add friends'
					className="text-xs text-blue py-2 pl-9 pr-2 w-full mt-4 rounded-md focus:outline-none focus:border-pink"
					onChange={handleInputChange}
				/>
				<span className="absolute inset-y-0 left-0 pl-3 pt-3.5 flex items-center">
					{isTyping ? (
						<FaArrowTurnUp className="text-gray-400 mt-1 w-3 h-3 transform rotate-90"/>
					) : (
						<FaUserPlus className="text-gray-400 w-4 h-4"/>
					)}
				</span>
			</div>
		</div>
		<NavVerticalFriends currentPage={currentPage}/>
	</div>
			<div className="flex-1 bg-black bg-opacity-20 p-4 md:rounded-r-lg"> 
				{children}
			</div>
	</div>
	)
}

export default FriendsLayout