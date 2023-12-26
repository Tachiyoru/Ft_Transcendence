import { useLocation } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"
import { IoIosArrowForward } from "react-icons/io";
import { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { RiTriangleFill } from "react-icons/ri";
import { useRef, useEffect } from "react";

const Game = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [clickedIndex, setClickedIndex] = useState<number | null>(null);	
    const [showBackIndex, setShowBackIndex] = useState<number | null>(null);
	const cardsRef = useRef<HTMLDivElement>(null);

	const names = ['Shan', 'Manu', 'Bob'];

    const toggleCard = (index: number) => {
        if (showBackIndex === index) {
            setShowBackIndex(null); // Retourner la carte si elle est déjà retournée
        } else {
            setShowBackIndex(index); // Retourner la carte cliquée
        }
    };

	useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cardsRef.current && !cardsRef.current.contains(event.target as Node)) {
                setShowBackIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


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
				<div className="flex flex-row space-x-4">
					
					{/*GAME 1*/}
					<div className={`flex w-full h-96 p-4 rounded-lg grid grid-rows-[2fr,auto] bg-filter bg-opacity-75 ${showBackIndex === 0 ? 'hidden' : ''}`}>
						<div className="relative">
						<img src="src/game.png" alt='img' className="w-full h-60"/>
							<div className="absolute inset-0 flex items-center justify-center">
								<p className="text-4xl text-center font-audiowide text-lilac mix-blend-difference">1 vs 1</p>
							</div>	
						</div>
						<div className="px-2 pb-4">
						<div className="flex flex-col justify-end space-y-2 px-2 py-2 rounded-md bg-purple">
							<button className="flex flex-row justify-between items-center hover" onClick={() => toggleCard(0)}>
								<div  className="text-xs text-lilac">Invite friends</div>
								<IoIosArrowForward className="w-2 h-2 text-lilac"/>
							</button>
							<div className="border-t border-lilac"></div>
							<div className="flex flex-row justify-between items-center">
								<div className="text-xs text-lilac">Random player</div>
								<IoIosArrowForward className="w-2 h-2 text-lilac"/>
							</div>
						</div>
						</div>
					</div>
					<div
					ref={cardsRef}
					className={`flex h-96 w-full rounded-md bg-dark-violet border-container grid grid-rows-[2fr,auto] p-4 ${showBackIndex === 0 ? '' : 'hidden'}`}
						>
						<div className="relative">
							{/*LIST*/}
							<div className="w-full h-5/6 bg-filter mt-4 mb-10">
								<h3 className='absolute top-0 text-lilac text-xl font-audiowide pl-2'>choose a player</h3>
								<div className="py-4">

								{names.map((name, index) => (
										<div
											key={index}
											className="flex flex-row justify-content items-center px-4 py-1"
											onMouseEnter={() => setHoveredIndex(index)}
											onMouseLeave={() => setHoveredIndex(null)}
											onClick={() => setClickedIndex(index)}
										>
											<div className="mr-2">
											{index === clickedIndex || index === hoveredIndex ? (
												<RiTriangleFill className="w-[8px] h-[8px] text-lilac transform rotate-90" />
												) : ( <div className="w-[8px] h-[8px]"></div> )}
											</div>
											<div className="w-[20px] h-[20px] bg-purple rounded-full grid justify-items-center items-center">
												<FaUser className="w-[8px] h-[8px] text-lilac" />
											</div>
										<p className={`text-sm font-regular ml-2 ${index === hoveredIndex || index === clickedIndex ? 'text-lilac' : 'text-lilac opacity-60'}`}>{name}</p>
									</div>
									
								))}
								<p className="absolute bottom-4 text-lilac pl-2 font-audiowide">0/1</p>
								</div>
							</div>
						</div>
						<div className="flex flex-col justify-end mb-6">
							<div className="flex flex-row items-center my-2 m-auto ">
								<div className="border-t w-12 border-lilac"></div>
								<span className="mx-4 text-sm text-lilac">OR</span>
								<div className="border-t w-12 border-lilac"></div>
							</div>
							<div className="flex flex-row justify-between items-center bg-purple p-2 mx-4 rounded-md">
								<div className="text-xs text-lilac">Random player</div>
								<IoIosArrowForward className="w-2 h-2 text-lilac"/>
							</div>
						</div>
					</div>

					{/*GAME 2*/}
					<div className={`flex w-full h-96 p-4 rounded-lg grid grid-rows-[2fr,auto] bg-filter bg-opacity-75 ${showBackIndex === 1 ? 'hidden' : ''}`}>
						<div className="relative">
						<img src="src/game.png" alt='img' className="w-full h-60"/>
							<div className="absolute inset-0 flex items-center justify-center">
								<p className="text-4xl text-center font-audiowide text-lilac mix-blend-difference">2 vs 2</p>
							</div>	
						</div>
						<div className="px-2 pb-4">
						<div className="flex flex-col justify-end space-y-2 px-2 py-2 rounded-md bg-purple">
							<button className="flex flex-row justify-between items-center hover" onClick={() => toggleCard(1)}>
								<div  className="text-xs text-lilac">Invite friends</div>
								<IoIosArrowForward className="w-2 h-2 text-lilac"/>
							</button>
							<div className="border-t border-lilac"></div>
							<div className="flex flex-row justify-between items-center">
								<div className="text-xs text-lilac">Random player</div>
								<IoIosArrowForward className="w-2 h-2 text-lilac"/>
							</div>
						</div>
						</div>
					</div>
					<div
					ref={cardsRef}
					className={`flex h-96 w-full rounded-md bg-dark-violet border-container grid grid-rows-[2fr,auto] p-4 ${showBackIndex === 1 ? '' : 'hidden'}`}
						>
						<div className="relative">
							{/*LIST*/}
							<div className="w-full h-5/6 bg-filter mt-4 mb-10">
								<h3 className='absolute top-0 text-lilac text-xl font-audiowide pl-2'>choose a player</h3>
								<div className="py-4">

								{names.map((name, index) => (
										<div
											key={index}
											className="flex flex-row justify-content items-center px-4 py-1"
											onMouseEnter={() => setHoveredIndex(index)}
											onMouseLeave={() => setHoveredIndex(null)}
											onClick={() => setClickedIndex(index)}
										>
											<div className="mr-2">
											{index === clickedIndex || index === hoveredIndex ? (
												<RiTriangleFill className="w-[8px] h-[8px] text-lilac transform rotate-90" />
												) : ( <div className="w-[8px] h-[8px]"></div> )}
											</div>
											<div className="w-[20px] h-[20px] bg-purple rounded-full grid justify-items-center items-center">
												<FaUser className="w-[8px] h-[8px] text-lilac" />
											</div>
										<p className={`text-sm font-regular ml-2 ${index === hoveredIndex || index === clickedIndex ? 'text-lilac' : 'text-lilac opacity-60'}`}>{name}</p>
									</div>
									
								))}
								<p className="absolute bottom-4 text-lilac pl-2 font-audiowide">0/3</p>
								</div>
							</div>
						</div>
						<div className="flex flex-col justify-end mb-6">
							<div className="flex flex-row items-center my-2 m-auto ">
								<div className="border-t w-12 border-lilac"></div>
								<span className="mx-4 text-sm text-lilac">OR</span>
								<div className="border-t w-12 border-lilac"></div>
							</div>
							<div className="flex flex-row justify-between items-center bg-purple p-2 mx-4 rounded-md">
								<div className="text-xs text-lilac">Random player</div>
								<IoIosArrowForward className="w-2 h-2 text-lilac"/>
							</div>
						</div>
					</div>

					{/*GAME 3*/}
					<div className="flex w-full p-8 rounded-lg grid grid-rows-[auto,1fr,auto] bg-filter bg-opacity-75">
					</div>
					
				</div>
			</div>

		</div>
	</MainLayout>
	)
}

export default Game