import { GoHomeFill } from "react-icons/go";
import { FaMagnifyingGlass, FaBell, FaUser } from "react-icons/fa6";
import { useState } from "react";


interface NavItemProps {
	href: string;
	name: string;
	icon: IconType;
	onClick: () => void;
}

const navItemsInfo = [
	{ name: "Research", type: "link", href: "/", icon: FaMagnifyingGlass },
	{ name: "Notifications", type: "link", href: "/", icon: FaBell },
	{ name: "Chat", type: "link", href: "/", icon: FaUser },
];


//const handleClose = () => setOpen(false);


const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, name }) => {
	let notificationDiv = null;

	if (name === 'Notifications') {
		notificationDiv =
		<div className="absolute top-0 right-2 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-white text-[0.4rem]">
			4
		</div>
	}

	return (
		<li className="relative group">
		<a href={href} className="px-4 py-2 flex items-center text-gray-400 relative">
			{notificationDiv}
			<Icon size={16} />
		</a>
		</li>
	);
};

const NavHorizontal = () => {

	const [open, setOpen] = useState(false);
	const toggleNotifications = () => {
		setOpen(!open);
	}
	
	return (
	<section>
		<header className="container mx-auto flex justify-between py-4 items-center">
			<div>
				<img src="" alt="" className="w-16" />
			</div>
			<div className="right-0">
				<ul className="flex gap-x-1 font-semibold">
				{navItemsInfo.map((item, index) => (
					<NavItem key={index} href={item.href} icon={item.icon} name={item.name} onClick={toggleNotifications}/>)
				)}
			</ul>
			{open && (
				<div className="notifications">
					<div>
						Mark as read
					</div>
					<button onClick={toggleNotifications}>Close Notifications</button>
				</div>
			)}
			</div>
		</header>
	
	</section>
	)
}

export default NavHorizontal