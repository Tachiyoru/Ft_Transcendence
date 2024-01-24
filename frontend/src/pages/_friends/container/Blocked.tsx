import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa6";
import axios from "../../../axios/api";

const Blocked = () => {
	const [blockedUsers, setBlockedUsers] = useState<{ id: number; username: string; avatar: string}[]>([]);
	
	useEffect(() => {
		const fetchBlockedUsers = async () => {
		try {
			const response = await axios.get("/friends-list/blocked-users");
			setBlockedUsers(response.data);
		} catch (error) {
			console.error("Error fetching blocked users:", error);
		}
		};

		fetchBlockedUsers();
	}, []);

	const unblockUser = async (userId: number) => {
		try {
			await axios.post(`/friends-list/unblock/${userId}`);
			const updatedBlockedUsers = blockedUsers.filter(user => user.id !== userId);
			setBlockedUsers(updatedBlockedUsers);
		} catch (error) {
			console.error('Error deblocked users:', error);
		}
	};

	return (
	<div className="mt-10 m-4 gap-4 flex flex-wrap">
		{/*TEST USER PENDING*/}
		{blockedUsers.map((user, index) => (
		<div key={index} className="flex flex-col items-center px-6">
			{user.avatar ?
				(
					<div>
						<img
						src={user.avatar}
						className="h-[80px] w-[80px] object-cover rounded-full mt-2"
						></img>
					</div>
				) : (
					<div className="w-[80px] h-[80px] bg-fushia rounded-full grid justify-items-center items-center mt-2">
						<FaUser className="w-[30px] h-[30px]" />
					</div>
				)
			}
			<p className="text-sm text-fushia bg-opacity-40 pt-2">{user.username}</p>
			<p
				className="text-xs text-lilac pt-2 underline hover:text-white"
				onClick={() => unblockUser(user.id)}
				style={{cursor: 'pointer'}}>
				Unblock
			</p>
		</div>
		))}
	</div>
	)
}

export default Blocked