import { AuthContextProvider } from "./context/AuthContext" 
import Routes from "./Routes"

const App:React.FC = () => {  
  return (
    <AuthContextProvider>
      <Routes/>
    </AuthContextProvider>
  )
}

export default App
