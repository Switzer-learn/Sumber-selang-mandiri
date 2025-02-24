import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser,FaLock } from "react-icons/fa";
import { api } from "../../service/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [failedLogin,setFailedLogin] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{
    const checkUser = async()=>{
      const currentUser = await api.getCurrentUser();
      if(currentUser){
        navigate('/adminpage')
      }
    }
    checkUser();
  },[])

  // Handle login form submission.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { email, password };
    console.log(formData);
    const loginResponse = await api.login(formData);
    if(loginResponse){
      if(loginResponse.status===200){
        alert(loginResponse.message)
        navigate("/adminpage")
      }else{
        alert(loginResponse.message)
      }
    }
  };

  const handleForgotPassword = async(e: React.FormEvent) =>{
    e.preventDefault();
    console.log("Forgot Password");
  }

  return (
    <div className='text-white bg-gradient-to-br from-blue-500 to-purple-500 min-h-screen'>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
          <img src='./Sakura_Spa_Logo.png' className='mx-auto w-40 h-auto' alt='Logo' />
          <h2 className="text-3xl font-extrabold text-center text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-center">Sign in to your account</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-10 py-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-10 py-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex justify-between text-sm text-gray-500">
              <button type="button" onClick={handleForgotPassword} className="hover:text-indigo-500">Forgot password?</button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;