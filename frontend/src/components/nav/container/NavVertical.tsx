import { GoHomeFill } from "react-icons/go";
import { RiGamepadFill, RiMessage3Fill } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";
import { Link } from "react-router-dom";

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

	return (
	<section>
		<header className="container my-12 mx-auto flex justify-between items-center">
			<div className="right-0">
				<ul className="flex-col">
				{navItemsInfo.map((item, index) => (
					<NavItem key={index} lien={item.lien} icon={item.icon} currentPage={currentPage}/>)
				)}
				</ul>
			</div>
		</header>
	
	</section>
	)
}

export default NavVertical