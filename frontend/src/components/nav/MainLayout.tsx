import NavHorizontal from "./container/NavHorizontal"
import NavVertical from "./container/NavVertical"

const MainLayout = ({ children, currentPage }) => {
  return (
	<div className="mr-10 ml-5 flex flex-col">
		<div> 
			<NavHorizontal />
		</div> 
		<div className="flex flex-row justify-between">
			<div className="w-1/12 mr-6"> 
				<NavVertical currentPage={currentPage} />
			</div>
			<div className="w-full ml-2 overflow-hidden"> 
				{children}
			</div>
		</div>
	</div>
	)
}

export default MainLayout