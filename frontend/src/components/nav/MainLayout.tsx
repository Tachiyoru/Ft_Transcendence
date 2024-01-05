import NavHorizontal from "./container/NavHorizontal"
import NavVertical from "./container/NavVertical"

const MainLayout = ({ children, currentPage }) => {
	return (
	<div>
		<div className="bg-violet-black-nav bg-opacity-50 h-screen">
			<div className="m-5 mt-2 h-full">
				<div className="mx-1"> 
					<NavHorizontal />
				</div> 
				<div className="flex flex-row mx-4 h-4/5">
					<div className="flex"> 
						<NavVertical currentPage={currentPage} />
					</div>
					<div className="flex-1 ml-2"> 
						{children}
					</div>
				</div>
			</div>
		</div>
	</div>
	)
}

export default MainLayout