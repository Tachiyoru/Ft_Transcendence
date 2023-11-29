import MainLayout from "../../components/nav/MainLayout"
import { useLocation } from 'react-router-dom';

const Chat = () => {
	const location = useLocation();
	const currentPage = location.pathname;

	return (
	<MainLayout currentPage={currentPage}>
	    <div className="flex flex-row h-[80vh]">
		
			{/*LEFT SIDE BAR*/}
			<div className="w-[260px] md:rounded-l-lg bg-violet-black p-4 text-gray-300 text-xs">
			</div>

			{/*MIDDLE*/}
			<div className="flex-1 bg-dark-violet p-4 text-gray-300 text-xs">
			</div>

			{/*RIGHT SIDE BAR*/}
			<div className="w-[260px] md:rounded-r-lg bg-violet-black p-4 text-gray-300 text-xs hidden lg:block">
			</div>~
		</div>
	</MainLayout>
	)
}

export default Chat