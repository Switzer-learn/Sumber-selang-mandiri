import { useState } from "react";
import { TextField, MenuItem, IconButton, InputAdornment, Button, Card, CardContent, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { api } from "../../service/api"

const EmployeeRegister = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "cashier",
    showPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setFormData((prevState) => ({ ...prevState, showPassword: !prevState.showPassword }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    const registerResponse = await api.register({email:formData.email,password:formData.password});
    if(registerResponse.status===200){
        const userId = registerResponse.user?.id;
        const addEmployeeResponse = await api.addUsers({id:userId,username:formData.email,role:formData.role})
        if(addEmployeeResponse){
            if(addEmployeeResponse.status===200){
                alert("Penambahan User Berhasil")
            } else {
                alert(addEmployeeResponse.message);
                console.log(addEmployeeResponse);
            }
        }else{
            alert("Something is wrong")
        }
        
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-2xl p-6">
        <CardContent>
          <Typography variant="h5" className="mb-4 text-center font-bold">
            Register Employee
          </Typography>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 gap-4">
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              name="password"
              type={formData.showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              select
              label="Role"
              variant="outlined"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="cashier">Cashier</MenuItem>
            </TextField>

            <Button type="submit" variant="contained" color="primary" fullWidth className="mt-2">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeRegister;
