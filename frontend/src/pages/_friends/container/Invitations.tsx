import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6"
import { FaCheck, FaXmark } from "react-icons/fa6";
import axios from "../../../axios/api";

const Invitations = () => {
	const [listUsers, setListUsers] = useState<{ id: number; username: string }[]>([]);

	useEffect(() => {
	const fetchUserData = async () => {
		try {
		const response = await axios.get<{ id: number; username: string }[]>('/friends-list/pending-list');
		console.log(response.data);
		
		setListUsers(response.data);
		} catch (error) {
		console.error('Error fetching user list:', error);
		}
	};
	fetchUserData();
	}, []);

	const acceptFriendRequest = async (userId: number) => {
        try {
            await axios.post(`/friends-list/friend-request/${userId}/accept`);
            const updatedList = listUsers.filter(user => user.id !== userId);
            setListUsers(updatedList);
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

	const rejectFriendRequest = async (userId: number) => {
        try {
			console.log(userId);
            await axios.delete(`/friends-list/friend-request/${userId}/reject`);
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

	return (
	<div className="mt-10 m-4 gap-4 flex flex-wrap">

		{/*TEST USER PENDING*/}
		{listUsers.map((user, index) => (
			<div key={index} className="flex flex-col items-center px-6">
				<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
					<FaUser className="w-[30px] h-[30px] text-lilac"/>
				</div>
				<p className="text-sm text-lilac pt-2">{user.username}</p>
				<div className="flex flex-row justify-between space-x-5">
					<div 
						className="w-[26px] h-[26px] mt-1 bg-dark-violet rounded-full grid justify-items-center items-center"
						onClick={() => acceptFriendRequest(user.id)}
						style={{cursor: 'pointer'}}
					>
						<FaCheck className="w-[10px] h-[10px] text-acid-green"/>
					</div>
					<div 
						className="w-[26px] h-[26px] mt-1 bg-dark-violet rounded-full grid justify-items-center items-center"
						onClick={() => rejectFriendRequest(user.id)}
						style={{cursor: 'pointer'}}
					>
						<FaXmark className="w-[10px] h-[10px] text-red-orange"/>
					</div>
				</div>
			</div>
        ))}

	</div>
	)
}

export default Invitations