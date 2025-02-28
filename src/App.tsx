
import LoginPage from "./components/Page/LoginPage";
//import SideMenu from "./components/Layout/SideMenu";
import AdminPage from "./components/Page/AdminPage"
import EmployeeRegister from "./components/Layout/AddEmployee";
import { Route,Routes,BrowserRouter} from "react-router-dom";
import ForgotPassword from "./components/Layout/ForgotPassword";
import NewPassword from "./components/Layout/NewPassword";
const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/register" element={<EmployeeRegister />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/newPassword" element={<NewPassword />} />
      </Routes>
  </BrowserRouter>
  )
}

export default App
