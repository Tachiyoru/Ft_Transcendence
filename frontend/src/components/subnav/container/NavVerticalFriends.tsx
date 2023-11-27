interface NavItemProps {
	href: string;
	name: string;
}

const navItemsInfo = [
	{ name: "All Friends", type: "link", href: "/friends"},
	{ name: "Invitations", type: "link", href: "/invitations"},
	{ name: "Blocked Friends", type: "link", href: "/blocked_friends"},
];


const NavItem: React.FC<NavItemProps & { currentPage: string }> = ({ href, name, currentPage }) => {

	const isCurrentPage = href === currentPage;

	const iconColorClass = isCurrentPage ? "text-light-purple bg-medium-purple" : "text-purple-unhoover";

	return (
	<li className="relative group">
		<a href={href} className={`text-end py-2 text-sm flex items-center ${iconColorClass} pl-4 mb-2 rounded-lg hover:bg-purple-hoover`}>
			{name}
		</a>
	</li>
	);
};

const NavVerticalFriends: React.FC<{ currentPage: string }> = ({ currentPage }) => {

	return (
	<section>
		<header className="mt-10 ml-6">
				<ul className="flex-col">
				{navItemsInfo.map((item, index) => (
					<NavItem key={index} href={item.href} name={item.name} currentPage={currentPage}/>)
				)}
				</ul>
		</header>
	
	</section>
	)
}

export default NavVerticalFriends