import { dbCustomers,dbProducts,dbProductsPurchases,dbTransactions,dbTransactionsItems,dbUsers } from "../components/interface/dbInterfaces";
import supabase from "../util/supabase";

interface credentials {
    email:string;
    password:string;
}

export const api = {
    addProduct: async (data: dbProducts) => {
        try {
            console.log(data);
            
        } catch (error) {
            console.error(error);
        }
    },

    addProductPurchases : async(data:dbProductsPurchases) => {
        try {
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    },

    fetchProducts: async () => {
        try {
            console.log("fetchProducts");
        } catch (error) {
            console.error(error);
        }
    },

    addTransactions: async(data:dbTransactions) => {
        try {
            console.log(data)
        } catch (error) {
            console.error(error)
        }
    },

    addTransactionItems: async(data:dbTransactionsItems) => {
        try {
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    },

    fetchTransaction : async() =>{
        try {
            console.log("fetch Transaction")
        } catch (error) {
            console.error(error);
        }
    },

    addCustomer : async(data:dbCustomers) => {
        try {
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    },

    fetchCustomer : async() => {
        try {
            console.log("fetchCustomer");
        } catch (error) {
            console.error(error);
        }
    },

    addUsers: async(input:dbUsers) => {
        try {
            console.log(input);
            const {error} = await supabase
                                        .from('users')
                                        .insert({
                                            id:input.id,
                                            username: input.username,
                                            role: input.role
                                        })
                                        .select();
            if(error){
                return {status:500,message:error}
            }
            return {status:200,message:"Penambahan user berhasil"}
        } catch (error) {
            console.error(error);
        }
    },

    fetchUsers: async() => {
        try {
            console.log("fetchUsers")
        } catch (error) {
            console.error(error);
        }
    },

    register: async (credentials:credentials) => {
        const { email, password } = credentials;
        
        // Sign up user with Supabase Auth
        const { data,error } = await supabase.auth.signUp(
          { email, password,
            options: {
            emailRedirectTo: 'http://localhost:5173',
            }, 
          }
          );
        if (error) {
          console.error("Registration error:", error);
          return { status: 400, message: error.message };
            }
        
        return { status: 200, message: "Registration successful", user: data.user };
      },
      
      forgotPassword:async(email:string)=>{
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: "https://sakuraspabwi.com/reset-password", // Customize this
        });
      
        if (error) {
          return {status:500,message:error}
        }
        return {status:200,message:'Password email sent'}
      },
      
      updatePassword:async(newPassword:string)=>{
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
      
        if (error) {
          return {message:error,status:500};
        } else {
          return {status:200,message:'Password resetted'}
        }
      },

      logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Logout error:", error);
          return { status: 500, message: error.message };
        }
        return { status: 200, message: "Logged out successfully" };
      },

      checkRole: async (id: string) => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', id);
      
          if (error) {
            return { status: 500, message: error };
          }
          if(data.length>0) {
            return { status: 200, message: 'User is an Admin', role:data };
          }else{
            return {status:404,message:"User not found"};
          }
        } catch (err) {
          console.error(err);
          return { status: 500, message: 'Unexpected error' };
        }
      },
      
      
      // **GET CURRENT LOGGED-IN USER**
      getCurrentUser: async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
          return null;
        }
        return data.user; // **Returns logged-in user's ID**
      },


      //userLogin
      login: async ({ email, password }: { email: string; password: string }) => { 
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.error("Login error:", error);
          return { status: 400, message: error.message };
        }
        return { status: 200, message: "Login successful", user: data.user };
      },
}