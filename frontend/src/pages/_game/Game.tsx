import { useLocation } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"
import { IoIosArrowForward } from "react-icons/io";


const Game = () => {
	const location = useLocation();
	const currentPage = location.pathname;

	return (
	<MainLayout currentPage={currentPage}>
		<div>
			{/*TITLE*/}
			<h1 className="text-xl font-outline-2 text-white px-4">Game</h1>
			<p className="text-sm text-lilac mt-3 w-4/5 px-4">
			A match lasts 3 minutes. You can choose to invite your friend(s) to play with you or play with someone random
			(some delay may occur because you can’t play by yourself) You can also watch someone else’s game.<br/><br/>

			You each have three bonus actions available: freeze, fire and invisibility. 
			They are reachable with keyboards 1, 2, and 3. They have a charging time of 20 seconds each.
			</p>

			{/*GAME*/}
			<div className="mt-12">
				<div className="flex flex-row space-x-8">
					
					{/*GAME 1*/}
					<div className="flex w-full h-96 p-4 rounded-lg grid grid-rows-[2fr,auto] bg-filter bg-opacity-75">
						<div className="relative">
						<img src="votre_image.jpg" className="w-full h-60"/>
							<div className="absolute inset-0 flex items-center justify-center">
								<p className="text-3xl text-center font-audiowide text-lilac mix-blend-difference">1 vs 1</p>
							</div>	
						</div>
						<div className="px-2 pb-6">
						<div className="flex flex-col justify-end space-y-2 px-2 py-2 rounded-md bg-purple">
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

					{/*GAME 2*/}
					<div className="flex w-full h-96 p-8 rounded-lg grid grid-rows-[auto,1fr,auto] bg-filter bg-opacity-75">
						<div></div>
						<div></div>
						<div className="flex flex-col justify-end space-y-2 px-2 py-2 rounded-lg bg-purple">
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

					{/*GAME 3*/}
					<div className="flex w-full p-8 rounded-lg grid grid-rows-[auto,1fr,auto] bg-filter bg-opacity-75">
						<div></div>
						<div></div>
						<div className="flex flex-col justify-end space-y-2 px-2 py-2 rounded-lg bg-purple">
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
			</div>

		</div>
	</MainLayout>
	)
}

export default Game