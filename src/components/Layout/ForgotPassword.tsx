import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Paper } from "@mui/material";
import supabase from "../../util/supabase";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "https://sumber-selang-mandiri.vercel.app/newPassword",
        });
    
        if (error) {
            alert(error.message);
        } else {
            alert("Password reset email sent!");
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100 text-gray-800">
            <Paper elevation={3} className="p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
                <Typography variant="h4" className="font-bold text-center text-blue-600 mb-2">
                    SUMBER SELANG MANDIRI
                </Typography>
                <Typography variant="h6" className="text-gray-700 mb-6">Forgot Password</Typography>
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <TextField 
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="flex justify-between w-full mt-2">
                        <Button variant="outlined" color="primary" onClick={() => navigate("/")}>Back</Button>
                        <Button type="submit" variant="contained" color="primary">Reset Password</Button>
                    </div>
                </form>
            </Paper>
        </div>
    );
};

export default ForgotPassword;
