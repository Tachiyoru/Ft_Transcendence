import { AuthProvider } from "./context/AuthContext"
import Routes from "./Routes"

const App:React.FC = () => {  
  return (
    <AuthProvider>
      <Routes/>
    </AuthProvider>
  )
}

export default App
