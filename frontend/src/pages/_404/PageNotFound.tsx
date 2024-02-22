import { FaArrowRightFromBracket } from "react-icons/fa6"
import { Link } from "react-router-dom"

function PageNotFound() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="mx-auto mb-24 w-40 text-right">
          <p className="font-kanit text-4xl font-bold text-purple font-outline-1">404</p>
          <p className="text-lilac" style={{ marginTop: "-0.9rem"}}>page not found</p>
          <div className='flex flex-row items-center gap-x-2 mt-6 text-sm text-lilac justify-end'>
            <FaArrowRightFromBracket className="transform rotate-180" size={10}/>
            <Link to={'/'}>
              <p className='underline'>Go back to homepage</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound