
import LoginPage from "./components/Page/LoginPage";
//import SideMenu from "./components/Layout/SideMenu";
import AdminPage from "./components/Page/AdminPage"
import EmployeeRegister from "./components/Layout/AddEmployee";
import { Route,Routes,BrowserRouter} from "react-router-dom";
const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/register" element={<EmployeeRegister />} />
      </Routes>
  </BrowserRouter>
  )
}

export default App
