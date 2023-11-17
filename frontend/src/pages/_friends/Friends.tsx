import { useLocation } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"

const Friends = () => {
	const location = useLocation();
	const currentPage = location.pathname;

	return (
	<MainLayout currentPage={currentPage}>
        <div className="flex justify-between" style={{height: '30rem'}}>
			<div className="w-1/4 bg-gray-200 p-6 mr-4">Friends</div>
			<div className="w-3/4 bg-gray-300 p-6 mr-4"></div>
        </div>
	</MainLayout>
	)
}

export default Friends