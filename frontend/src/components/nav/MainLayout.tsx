import NavHorizontal from "./container/NavHorizontal"
import NavVertical from "./container/NavVertical"

const MainLayout = ({ children, currentPage }) => {
  return (
	<div className="m-10">
		<div> 
			<NavHorizontal />
		</div> 
		<div className="flex flex-row">
		<div className="w-1/8"> 
			<NavVertical currentPage={currentPage} />
		</div>
		<div className="w-5/6 ml-4"> 
			{children}
		</div>
		</div>
	</div>
	)
}

export default MainLayout