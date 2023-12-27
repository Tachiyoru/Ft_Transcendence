import { FaUser } from 'react-icons/fa';

interface MemberAvatarProps {
    avatar?: string;
}

const MemberAvatar: React.FC<MemberAvatarProps> = ({ avatar }) => {
		return (
		<div>
			{avatar ? (
				<img
					src={avatar}
					className="h-[46px] w-[46px] object-cover rounded-full text-lilac"
					alt="User Avatar"
				/>
			) : (
				<div className="bg-purple rounded-full p-2 mt-2">
					<FaUser className="w-[80px] h-[80px] p-3 text-lilac" />
				</div>
			)}
		</div>
	);
};

export default MemberAvatar;
