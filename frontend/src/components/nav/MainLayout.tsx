import NavHorizontal from "./container/NavHorizontal"
import NavVertical from "./container/NavVertical"

const MainLayout = ({ children, currentPage }) => {
  return (
	<div className="m-5 mt-2">
		<div className="mx-1"> 
			<NavHorizontal />
		</div> 
		<div className="flex flex-row mx-4">
			<div className="flex"> 
				<NavVertical currentPage={currentPage} />
			</div>
			<div className="flex-1 ml-4"> 
				{children}
			</div>
		</div>
	</div>
	)
}

export default MainLayout