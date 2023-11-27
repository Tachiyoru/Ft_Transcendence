import { useLocation } from "react-router-dom";
import MainLayout from "../../../components/nav/MainLayout"
import FriendsLayout from "../../../components/subnav/FriendsLayout"

const Invitations = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	return (
		<MainLayout currentPage={currentPage}>
			<FriendsLayout currentPage={currentPage}>
			
			</FriendsLayout>
		</MainLayout>
	)
}

export default Invitations