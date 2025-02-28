import { useState } from "react";
import supabase from "../../util/supabase";
import { TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <Typography variant="h4" className="font-BonaNova font-bold text-center text-blue-600 mb-2">
          SUMBER SELANG MANDIRI
        </Typography>
        <h2 className="text-2xl font-semibold text-center mb-2">Reset Password</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {success ? (
          <p className="text-green-500 text-center mt-2">Password reset successfully!</p>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <TextField
              type="password"
              label="Enter New Password"
              placeholder="New Password"
              className="border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewPassword;
