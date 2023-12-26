import { FaBan, FaUser, FaUserGroup, FaXmark } from "react-icons/fa6"
import { IoIosArrowForward } from "react-icons/io"
import { RiGamepadFill } from "react-icons/ri"
import { Link } from "react-router-dom"

interface RightSidebarProps {
	isRightSidebarOpen: boolean;
	toggleRightSidebar: () => void;
}

const SidebarRightMobile: React.FC<RightSidebarProps> = ({ isRightSidebarOpen, toggleRightSidebar }) => {
  return (
	<div className={`absolute h-[80vh] top-0 right-0 w-[260px] md:rounded-r-lg bg-violet-black p-4 text-gray-300 text-xs ${isRightSidebarOpen ? 'block' : 'hidden'}`}>
			{/*CLOSE*/}
			<button className="lg:hidden flex-end" onClick={toggleRightSidebar}>
				<FaXmark className="w-4 h-4 text-lilac"/>
			</button>

			{/*CHAT*/}
			<div className="flex flex-col items-center">
				<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
					<FaUser className="w-[30px] h-[30px] text-lilac"/>
				</div>
				<p className="text-sm text-lilac pt-2">Name</p>
			</div>

			<nav className="mt-4">
				<ul className="text-lilac">
					<li>
						<Link to="/settings">
							<div className="flex flex-row items-center">
								<FaUser className="w-3 h-4 mr-2"/>
								<p className="hover:underline">See Profile</p>
							</div>
						</Link>
					</li>
					<li>
						<Link to="/settings">
							<div className="flex flex-row items-center">
								<RiGamepadFill className="w-3 h-4 mr-2"/>
								<p className="hover:underline">Invite to play</p>
							</div>
						</Link>
					</li>
					<li>
						<Link to="/settings">
							<div className="flex flex-row items-center">
								<FaBan className="w-3 h-4 mr-2"/>
								<p className="hover:underline">Block</p>
							</div>
						</Link>
					</li>

				</ul>
			</nav>

			<div className="flex flex-col justify-end space-y-2 px-2 py-2 mt-4 rounded-lg bg-purple">
				<div className="flex flex-row justify-between items-center">
					<div className="text-xs text-lilac">Invite friends</div>
					<IoIosArrowForward className="w-2 h-2 text-lilac"/>
				</div>
				<div className="border-t border-lilac"></div>
					<div className="flex flex-row justify-between items-center">
						<div className="text-xs text-lilac">Random player</div>
						<IoIosArrowForward className="w-2 h-2 text-lilac"/>
					</div>
				</div>

				{/*GROUP*/}
				<div className="flex flex-col items-center">
					<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
						<FaUserGroup className="w-[30px] h-[30px] text-lilac"/>
					</div>
					<p className="text-sm text-lilac pt-2">GROUP NAME</p>
					<p className="text-xs text-lilac pt-2">Public - 5 members</p>
				</div>
				<div className="flex flex-col justify-end p-2 mt-4 mx-4 rounded-lg bg-purple">
					<div className="flex flex-row justify-between items-center w-full">
						<div className="text-xs text-lilac">Join group</div>
						<IoIosArrowForward className="w-2 h-2 text-lilac"/>
					</div>
				</div>

				<div className="flex items-center mx-4 mt-4">
					<div className="w-[20px] h-[20px] bg-purple rounded-full grid justify-items-center items-center">
						<FaUser className="w-[8px] h-[8px] text-lilac"/>
					</div>
					<p className='text-xs text-lilac ml-2'>Name</p>
				</div>



		</div>	
  )
}

export default SidebarRightMobile