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
			<h1 className="text-xl">Choose your game</h1>
			<p className="text-sm mt-3">
				A match lasts 3 min. You can choose to invite your friend(s) to play with you or play with someone random.
				Some delay may occur because you can’t play by yourself.
			</p>

			{/*GAME*/}
			<div className="mt-12">
				<div className="flex flex-row space-x-8">
					
					{/*GAME 1*/}
					<div className="flex w-full h-80 p-4 rounded-lg grid grid-rows-[auto,1fr,auto] bg-black bg-opacity-20">
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

					{/*GAME 2*/}
					<div className="flex w-full h-80 p-4 rounded-lg grid grid-rows-[auto,1fr,auto] bg-black bg-opacity-20">
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
					<div className="flex w-full h-80 p-4 rounded-lg grid grid-rows-[auto,1fr,auto] bg-black bg-opacity-20">
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