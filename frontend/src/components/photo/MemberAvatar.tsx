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
					className="h-[42px] w-[42px] object-cover rounded-full text-lilac"
					alt="User Avatar"
				/>
			) : (
				<div className="bg-purple rounded-full mt-2">
					<FaUser className="w-[40px] h-[40px] p-3 text-lilac" />
				</div>
			)}
		</div>
	);
};

export default MemberAvatar;
