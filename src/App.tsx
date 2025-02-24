
import LoginPage from "./components/Page/LoginPage";
//import SideMenu from "./components/Layout/SideMenu";
import AdminPage from "./components/Page/AdminPage"
import { Route,Routes,BrowserRouter} from "react-router-dom";
const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/AdminPage" element={<AdminPage />} />
      </Routes>
  </BrowserRouter>
  )
}

export default App
