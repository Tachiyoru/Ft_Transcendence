import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"

const Friends = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	return (
		<MainLayout currentPage={currentPage}>
			<Outlet/>
		</MainLayout>
	)
}

export default Friends