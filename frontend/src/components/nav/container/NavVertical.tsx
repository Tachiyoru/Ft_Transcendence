import { GoHomeFill } from "react-icons/go";
import { RiGamepadFill, RiMessage3Fill } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";

interface NavItemProps {
	href: string;
	icon: IconType;
}

const navItemsInfo = [
	{ name: "Dashboard", type: "link", href: "/", icon: GoHomeFill },
	{ name: "Game", type: "link", href: "/game", icon: RiGamepadFill },
	{ name: "Chat", type: "link", href: "/chat", icon: RiMessage3Fill },
	{ name: "Friends", type: "link", href: "/friends", icon: FaUserGroup},
];


const NavItem: React.FC<NavItemProps & { currentPage: string }> = ({ href, icon: Icon, currentPage }) => {

	const isCurrentPage = href === currentPage;

	const iconColorClass = isCurrentPage ? "text-white" : "text-gray-300";

	return (
	<li className="relative group">
		<a href={href} className={`px-2 py-2 flex items-center ${iconColorClass} bg-gray-400 m-5 rounded-lg transition duration-300 ease-in-out hover:bg-gray-500 hover:scale-110`}>
			<Icon size={32} />
		</a>
	</li>
	);
};

const NavVertical: React.FC<{ currentPage: string }> = ({ currentPage }) => {

	return (
	<section>
		<header className="container mx-auto flex justify-between py-4 items-center">
			<div className="right-0">
				<ul className="flex-col font-semibold">
				{navItemsInfo.map((item, index) => (
					<NavItem key={index} href={item.href} icon={item.icon} currentPage={currentPage}/>)
				)}
				</ul>
			</div>
		</header>
	
	</section>
	)
}

export default NavVertical