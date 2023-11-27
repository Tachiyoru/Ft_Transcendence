import MainLayout from "../../components/nav/MainLayout"
import { useLocation } from 'react-router-dom';

const Chat = () => {
	const location = useLocation();
	const currentPage = location.pathname;

	return (
	<MainLayout currentPage={currentPage}>
	    <div className="flex flex-row h-[80vh]">
		
		{/*LEFT SIDE BAR*/}
		<div className="w-[425px] md:rounded-l-lg bg-dark-purple p-4 text-gray-300 text-xs">
		</div>

		{/*MIDDLE*/}
		<div className="w-full bg-gray-300 p-4 text-gray-300 text-xs">
		</div>

		{/*RIGHT SIDE BAR*/}
		<div className="w-[400px] md:rounded-r-lg bg-dark-purple p-4 text-gray-300 text-xs">
		</div>
		</div>
	</MainLayout>
	)
}

export default Chat