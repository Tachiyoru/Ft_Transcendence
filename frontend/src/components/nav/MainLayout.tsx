import NavHorizontal from "./container/NavHorizontal"
import NavVertical from "./container/NavVertical"

const MainLayout = ({ children, currentPage }) => {
  return (
	<div className="m-10">
		<div> 
			<NavHorizontal />
		</div> 
		<div className="flex flex-row">
			<div className="md:w-1/12 sm:w-2/12"> 
				<NavVertical currentPage={currentPage} />
			</div>
			<div className="w-11/12 ml-4"> 
				{children}
			</div>
		</div>
	</div>
	)
}

export default MainLayout