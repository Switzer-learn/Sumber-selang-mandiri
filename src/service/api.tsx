import { dbCustomers,dbProducts,dbProductsPurchases,dbTransactions,dbTransactionsItems,dbUpdateProductPricenStock,dbUsers } from "../components/interface/dbInterfaces";
import supabase from "../util/supabase";

interface credentials {
    email:string;
    password:string;
}

export const api = {
  addProduct: async (input: dbProducts) => {
      try {  
          // Insert product with the authenticated user's ID
          const { error: insertError } = await supabase.from("products").insert({
              name: input.name,
              type: input.type,
              unit: input.unit,
              description: input.description,
              sell_price: input.sell_price,
          })
  
          if (insertError) {
              return { status: 500, message: insertError };
          }
  
          return { status: 200, message: "Tambah Produk Berhasil" };
      } catch (err) {
          console.error(err);
          return { status: 500, message: err };
      }
  },

  updateProductPricenStock: async (input: dbUpdateProductPricenStock) => {
      try {
        console.log(input);
          const { error } = await supabase.from("products").update({
              avg_buy_price: input.avg_buy_price,
              stock: input.stock
          }).eq("id", input.id);
  
          if (error) {
              return { status: 500, message: error };
          }
  
          return { status: 200, message: "Update Produk Berhasil" };
      } catch (err) {
          console.error(err);
          return { status: 500, message: err };
      }
  },
  

    addProductPurchases : async(input:dbProductsPurchases) => {
      const user = supabase.auth.getUser();
      console.log(user);
      const {product_id,quantity_purchased,buying_price} = input
        try {
            console.log(input);
            const {data,error} = await supabase
              .from("product_purchases")
              .insert([{
                product_id:product_id,
                quantity_purchased:quantity_purchased,
                buying_price:buying_price
              }])
              .select()
            if(error){
              return {status:500, message:error,data:[]}
            }
            return {status:200,data:data,message:"success"}
        } catch (error) {
            console.error(error);
            return {status:500, message:error,data:[]};
        }
    },

    fetchProducts: async () => {
        try {
            const {data,error} = await supabase
              .from("products")
              .select("*")
              .order("name", { ascending: true });

            if(error){
              return {status:500, message:error,data:[]}
            }
            return {status:200,data:data,message:"success"};
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
            const {data,error} = await supabase
              .rpc("get_transaction_details")

            if(error){
              return {status:500,message:error}
            }
            return {status:200,data:data};
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
            const {data,error} = await supabase
              .from("customers")
              .select("*")
              .order("name",{ascending:true});

            if(error){
              return {status:500,message:error};
            }
            return {status:200,data:data};
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