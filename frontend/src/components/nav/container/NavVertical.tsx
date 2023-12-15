import { GoHomeFill } from "react-icons/go";
import { RiGamepadFill, RiMessage3Fill } from "react-icons/ri";
import { FaArrowRightFromBracket, FaUserGroup } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { setLogout } from "../../../services/UserSlice";
import { useDispatch } from "react-redux";
import axios from "../../../axios/api";

interface NavItemProps {
	lien: string;
	icon: IconType;
}

const navItemsInfo = [
	{ name: "Dashboard", type: "link", lien: "/", icon: GoHomeFill },
	{ name: "Game", type: "link", lien: "/game", icon: RiGamepadFill },
	{ name: "Chat", type: "link", lien: "/chat", icon: RiMessage3Fill },
	{ name: "Friends", type: "link", lien: "/friends", icon: FaUserGroup},
];


const NavItem: React.FC<NavItemProps & { currentPage: string }> = ({ lien, icon: Icon, currentPage }) => {

	const isCurrentPage = lien === currentPage;

	const iconColorClass = isCurrentPage ? "text-fushia bg-purple" : "text-accent-violet";

	return (
	<li className="relative group">
		<Link to={lien} className={`px-3 py-3 flex items-center ${iconColorClass} bg-violet-black mb-4 mr-4 rounded-lg transition duration-300 ease-in-out hover:bg-purple hover:scale-110`}>
			<Icon size={28} />
		</Link>
	</li>
	);
};

const NavVertical: React.FC<{ currentPage: string }> = ({ currentPage }) => {
	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(setLogout());
		axios
		.post('/auth/logout')
		.catch((error) => {
			console.error('Erreur lors de la déconnexion côté serveur :', error);
		});
	};

	const navItemStyle = "px-3 py-3 flex items-center bg-violet-black mb-4 mr-4 rounded-lg transition duration-300 ease-in-out hover:bg-purple hover:scale-110";

	return (
	<section className="flex flex-col h-full">
		<ul className="flex-col flex-grow mt-12">
			{navItemsInfo.map((item, index) => (
				<NavItem key={index} lien={item.lien} icon={item.icon} currentPage={currentPage}/>)
			)}
		</ul>
		<button className={`flex items-center ${navItemStyle} mb-12`} onClick={handleLogout}>
			<FaArrowRightFromBracket className="text-accent-violet" size={26}/>
		</button>
	</section>
	)
}

export default NavVertical