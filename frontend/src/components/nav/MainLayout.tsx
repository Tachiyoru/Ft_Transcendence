import NavHorizontal from "./container/NavHorizontal"
import NavVertical from "./container/NavVertical"

const MainLayout = ({ children, currentPage }) => {
	return (
		<div className="bg-violet-black-nav bg-opacity-50">
			<div className="m-5 mt-2 h-full">
				<div className="mx-1"> 
					<NavHorizontal />
				</div> 
				<div className="flex flex-row mx-4 h-4/5">
					<div className="flex"> 
						<NavVertical currentPage={currentPage} />
					</div>
					<div className="flex-1 ml-2 h-full"> 
						{children}
					</div>
				</div>
			</div>
		</div>
	)
}

export default MainLayout