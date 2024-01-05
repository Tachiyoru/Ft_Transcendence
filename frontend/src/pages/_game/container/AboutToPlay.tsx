import { useLocation } from "react-router-dom";
import MainLayout from "../../../components/nav/MainLayout"
import { FaUser } from "react-icons/fa6";

const AboutToPlay = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	return (
		<MainLayout currentPage={currentPage}>
		<div className="flex-1 bg-violet-black h-full flex justify-center items-center text-lilac">
			<div className="grid grid-cols-1 gap-20 text-center">
			<div>
				<h3 className="font-audiowide text-2xl mb-12">Get ready</h3>
				<div className="flex flex-row justify-center gap-14 mb-32">
				<div className="flex flex-col">
						<div className="bg-purple rounded-full p-2 mb-2">
							<FaUser className="w-[60px] h-[60px] p-3 text-lilac"/>
						</div>
						<p>Name</p>
					</div>
					<div className="flex flex-col">
						<div className="bg-lilac rounded-full p-2 mb-2">
							<FaUser className="w-[60px] h-[60px] p-3 text-purple"/>
						</div>
						<p>Name</p>
					</div>
				</div>
			</div>
			<p className="font-audiowide text-purple">Your game is <br/> about to begin</p>
			</div>
		</div>
		</MainLayout>
	)
}

	export default AboutToPlay