import { FaMagnifyingGlass, FaBell, FaUser } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import { Link } from "react-router-dom";


interface NavItemProps {
	name: string;
	icon: IconType;
	onClick: () => void;
	selectedSection?: string | null;
}

const navItemsInfo = [
	{ name: "Research", icon: FaMagnifyingGlass },
	{ name: "Notifications", icon: FaBell },
	{ name: "Chat", icon: FaUser },
];


const NavItem: React.FC<NavItemProps> = ({ icon: Icon, name, onClick, selectedSection }) => {
	const [showDescription, setShowDescription] = useState(false);

	return (
		<div className="relative group">   

		{/* ICON */}
		<a 
			className="px-3 py-2 flex items-center text-purple relative hover:text-fushia" 
			onMouseEnter={() => setShowDescription(true)}
			onMouseLeave={() => setShowDescription(false)}
			onClick={() => onClick()}
		>
			<Icon size={14} />
		</a>

		{/* DESCRIPTION */}
		{showDescription && !selectedSection && (
			<span className="absolute left-1/2 transform -translate-x-1/2 top-8 text-sm font-normal text-white py-1 px-2 bg-gray-400 rounded-lg">
				{name === "Notifications" && "Notifications"}
				{name === "Chat" && "Chat"}
			</span>
		)}
		</div>
	);
};

const NavHorizontal = () => {
	const [selectedSection, setSelectedSection] = useState<string | null>(null);
	const [prevSelectedSection, setPrevSelectedSection] = useState<string | null>(null)

	const toggleSection = (sectionName: string) => {
		if (selectedSection === sectionName || prevSelectedSection == sectionName)
		{
			setPrevSelectedSection(null);
			setSelectedSection(null);
		} else {
			setPrevSelectedSection(sectionName);
			setSelectedSection(sectionName);
		}
	};
	
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
		if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
			setSelectedSection(null);
		}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
		document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [menuRef]);

	const getContent = () => {
		if (selectedSection === "Notifications") {
			return (
			<div ref={menuRef} className="shadow-md bg-dark-violet rounded-lg py-2 px-4 absolute right-2 mt-1">
				<div className="text-xs font-normal text-param">
				Notifications
				</div>
			</div>
			);
		} else if (selectedSection === "Chat") {
			return (
			<div ref={menuRef} className="shadow-md bg-dark-violet rounded-lg p-4 w-35 absolute right-2 mt-1">
				<ul className="">
					<li className="text-sm font-light text-lilac mb-1">
						<Link to="/settings" >
							<div className="flex flex-row items-center">
								<FaUser className="w-3 h-2 mr-2"/>
								<p className="hover:underline">Profile</p>
							</div>
						</Link>
					</li>
					<li className="text-sm font-light text-lilac">
						<Link to="/settings">
							<div className="flex flex-row items-center">
								<MdSettings className="w-3 h-4 mr-2"/>
								<p className="hover:underline">Settings</p>
							</div>
						</Link>
					</li>
				</ul>
			</div>
			);
		}
		return null;
	};

	return (
	<section>
		<header className="flex justify-between pt-4 pb-4">
			{/* LOGO */}
			<div>
				<img src="" alt="" className="w-16" />
			</div>

			{/* NAV */}
			<div className="right-0">
				<ul className="flex gap-x-1 font-semibold">
				{navItemsInfo.map((item, index) => (
					<div key={index}>
					<li>
						<NavItem 
							icon={item.icon}
							name={item.name}
							onClick={() => {
								toggleSection(item.name);
							}}
							selectedSection={selectedSection}
						/>
					</li>

					{selectedSection === item.name && (
						<div className="relative">
							{getContent()}
						</div>
					)}
					
					</div>
				))}
			</ul>
			</div>
		</header>
	</section>
	)
}

export default NavHorizontal