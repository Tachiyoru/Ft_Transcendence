import { FaArrowTurnUp, FaBan, FaMagnifyingGlass, FaPaperPlane, FaUser, FaUserGroup, FaXmark } from "react-icons/fa6";

import MainLayout from "../../components/nav/MainLayout"
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { RiGamepadFill } from "react-icons/ri";

type FilterType = 'all' | 'personnal' | 'channel'; 

const Chat = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	const [isTyping, setIsTyping] = useState(false);
	const [filtreActif, setFiltreActif] = useState<FilterType>('all');
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

	const toggleRightSidebar = () => {
		setIsRightSidebarOpen(!isRightSidebarOpen);
	  };

	const handleInputChange = (e) => {
			const inputValue = e.target.value;
			setIsTyping(inputValue !== '');
	};

	const handleFiltre = (type: FilterType) => {
		setFiltreActif(type);
		window.location.hash = type;
	};

	const contenuFiltre: { [key in FilterType]: JSX.Element } = {
		all: <div></div>,
		personnal: <div></div>,
		channel: <div></div>,
	};

	useEffect(() => {
		const hash = window.location.hash.substr(1) as FilterType;
		if (hash && ['all', 'personnal', 'channel'].includes(hash)) {
		setFiltreActif(hash);
		}
	}, []);

	return (
	<MainLayout currentPage={currentPage}>
	    <div className="flex flex-row h-[80vh]">
		
			{/*LEFT SIDE BAR*/}
			<div className="w-[66px] md:w-[260px] md:rounded-l-lg bg-violet-black p-2 md:p-4 text-gray-300 flex-col space-y-3">
				
				<div>
					{/*TITLE*/}
					<h1 className="hidden md:block font-outline-2 mt-6 m-2 text-white">Friends</h1>
					{/*RESEARCH BAR*/}
					<div className="relative">
						<div className="flex items-center">
						<input
							type='text'
							placeholder='Research friends'
							className="text-xs m-2 placeholder-lilac text-lilac py-2 pl-9 pr-2 w-full mt-4 rounded-md bg-purple focus:outline-none focus:border-fushia hidden md:block"
							onChange={handleInputChange}
							/>
							<span className="absolute inset-y-0 left-0 pl-3 pt-3.5 mt-2 flex items-center hidden md:block">
							{isTyping ? (
								<FaArrowTurnUp className="text-violet-black mt-1 w-3 h-3 transform rotate-90 m-2 mt-1"/>
							) : (
								<FaMagnifyingGlass className="text-violet-black w-3 h-3 m-2 mt-1"/>
							)}
							</span>
						</div>
					</div>
					{/*NAV*/}
					<nav className="hidden md:block">
						<ul className='m-2 flex flex-row justify-between'>
							<li className={`text-sm text-lilac ${filtreActif === 'all' ? 'bg-violet-black-nav py-2 p-4 rounded-md' : 'py-2 p-4'}`} onClick={() => handleFiltre('all')}>All</li>
							<li className={`text-sm text-lilac ${filtreActif === 'personnal' ? 'bg-violet-black-nav py-2 p-4 rounded-md' : 'py-2 p-4'}`} onClick={() => handleFiltre('personnal')}>Personnal</li>
							<li className={`text-sm text-lilac ${filtreActif === 'channel' ? 'bg-violet-black-nav py-2 p-4 rounded-md' : 'py-2 p-4'}`} onClick={() => handleFiltre('channel')}>Channel</li>
						</ul>
            		</nav>
          		</div>

				{/*USER*/}
				<div className="flex flex-row h-12 md:mx-2">
					<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
						<FaUser className="text-lilac"/>
					</div>
					<div className="pt-3 hidden md:block">
						<p className="text-base text-lilac">Name</p>
						<div className="flex flex-row">
							<p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">Lorem ipsum dolor…</p>
							<p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
						</div>
					</div>
				</div>

				{/*CHANNEL*/}
				<div className="flex flex-row h-12 md:m-2">
				<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
						<FaUserGroup className="text-lilac"/>
					</div>
					<div className="pt-3 hidden md:block">
						<div className="flex flex-row justify-between">
							<p className="text-base text-lilac">Channel</p>
							<p className="text-sm text-lilac text-opacity-60">Public</p>
						</div>
						<div className="flex flex-row">
							<p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">Lorem ipsum dolor…</p>
							<p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
						</div>
					</div>
				</div>
				
			</div>

			{/*MIDDLE*/}
			<div className="flex-1 flex flex-col justify-between bg-dark-violet p-4 text-gray-300 text-xs relative p-8">
				{/*NAME*/}
				<div>
					<div className="flex flex-row justify-between">
						<h3 className="text-base text-lilac">Name</h3>
						<button className="lg:hidden flex-end" onClick={toggleRightSidebar}>
							<FaUserGroup className="w-4 h-4 text-lilac"/>
						</button>
					</div>
					{/*CONTENT*/}
					<div className="flex flex-row h-12 mt-6">
						<div className="w-[45px] h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center mr-4">
							<FaUser className="text-lilac"/>
						</div>
						<div className="pt-3">
							<p className="text-base text-lilac">Name</p>
							<div className="flex flex-row">
								<p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">Lorem ipsum dolor…</p>
								<p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
							</div>
						</div>
					</div>
				</div>

				{/*SEND*/}
				<div>
					<div className="flex items-center relative">
						<input className="py-2 bg-lilac w-full rounded-md"/>
						<span className="absolute right-4">
							<FaPaperPlane className="w-3 h-3 text-violet-dark"/>
						</span>
					</div>
				</div>
				<div className={`absolute h-[80vh] top-0 right-0 w-[260px] md:rounded-r-lg bg-violet-black p-4 text-gray-300 text-xs ${isRightSidebarOpen ? 'block' : 'hidden'}`}>
					{/*CLOSE*/}
					<button className="lg:hidden flex-end" onClick={toggleRightSidebar}>
						<FaXmark className="w-4 h-4 text-lilac"/>
					</button>

					{/*TEST USER FRIEND*/}
					<div className="flex flex-col items-center">
						<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
							<FaUser className="w-[30px] h-[30px] text-lilac"/>
						</div>
						<p className="text-sm text-lilac pt-2">Name</p>
					</div>

					{/*NAV PERSONNAL CONV*/}
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

					{/*NAV PERSONNAL CONV*/}
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
					</div>
			</div>




			{/*RIGHT SIDE BAR*/}
			<div className="w-[26~0px] md:rounded-r-lg bg-violet-black p-4 text-gray-300 text-xs hidden lg:block">
				{/*TEST USER FRIEND*/}
				<div className="flex flex-col items-center relative px-6">
					<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
						<FaUser className="w-[30px] h-[30px] text-lilac"/>
					</div>
					<p className="text-sm text-lilac pt-2">Name</p>
				</div>
			
			</div>
		</div>
	</MainLayout>
	)
}

export default Chat