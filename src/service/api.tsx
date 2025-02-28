import { dbCustomers,dbProducts,dbProductsPurchases,dbUpdateProductPricenStock,dbUsers } from "../components/interface/dbInterfaces";
import supabase from "../util/supabase";

interface credentials {
    email:string;
    password:string;
}

interface TransactionInputData{
  customer_id:string,
  cashier_id:string,
  grand_total:number,
  metode_pembayaran:string,
  date:string
}

interface TransactionItemsInputData{
  transaction_id:string,
  product_id:string,
  amount:number,
  price:number
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
              return {status:500, message:error.message,data:[]}
            }
            return {status:200,data:data,message:"success"}
        } catch (error) {
            console.error(error);
            return {status:500, message:error,data:[]};
        }
    },

    fetchPurchaseHistory: async () => {
      const{data,error} = await supabase.rpc('get_purchase_details');
      if(error){
        console.log(error)
        return {status:500, message:error.message,data:[]}
      }
      console.log(data)
      return {status:200,data:data,message:"success"}
    },

    fetchProducts: async () => {
        try {
            const {data,error} = await supabase
              .from("products")
              .select("*")
              .order("name", { ascending: true });

            if(error){
              return {status:500, message:error.message,data:[]}
            }
            return {status:200,data:data,message:"success"};
        } catch (error) {
            console.error(error);
        }
    },
//new from deepseek
    fetchSingleProduct: async (productId: string) => {
        try {
            const { data, error } = await supabase
              .from("products")
              .select("*")
              .eq("id", productId)
              .single();

            if (error) {
                return { status: 500, message: error, data: null };
            }
            return { status: 200, data: data, message: "success" };
        } catch (error) {
            console.error(error);
            return { status: 500, message: error, data: null };
        }
    },

    updateProduct : async(input:dbProducts) => {
      const {id,name,description,type,unit,sell_price} = input
        try {
            const {data,error} = await supabase
              .from("products")
              .update({
                name:name,
                description:description,
                type:type,
                unit:unit,
                sell_price:sell_price
              })
              .eq("id",id)
              .select()
            if(error){
              return {status:500, message:error.message,data:[]}
            }
            return {status:200,data:data,message:"success"}
        } catch (error) {
            console.error(error);
            return {status:500, message:error,data:[]};
        }
    },

    deleteProduct : async(input:dbProducts) => {
      const {id} = input
        try {
            const {data,error} = await supabase
              .from("products")
              .delete()
              .eq("id",id)
              .select()
            if(error){
              return {status:500, message:error.message,data:[]}
            }
            return {status:200,data:data,message:"success"}
        } catch (error) {
          console.log(error)
          return {status:500,message:error,data:[]};
        }
    },
      
    

    addTransactions: async(input:TransactionInputData) => {
      const {customer_id,cashier_id,grand_total,metode_pembayaran} = input
        try {
            const { data, error } = await supabase
              .from("transactions")
              .insert({
                customer_id: customer_id,
                cashier_id: cashier_id,
                payment_type: metode_pembayaran,
                grand_total: grand_total
              }).select();
            if(error){
              return {status:500, message:error.message,data:[]}
            }
            return {status:200,data:data,message:"success"}
        } catch (error) {
            console.error(error)
        }
    },

    addTransactionItems: async(input:TransactionItemsInputData) => {
      const {transaction_id,amount,price,product_id} = input;
      console.log(input)
        try {
            const { data, error } = await supabase
              .from("transaction_items")
              .insert([{
                transaction_id:transaction_id,
                product_id:product_id,
                quantity:amount,
                unit_price:price,
                total_price:amount*price
              }])
              if(error){
                return {status:500, message:error.message,data:[]}
              }
              return {status:200,data:data,message:"success"}

        } catch (error) {
            console.error(error);
        }
    },

    fetchTransaction : async() =>{
        try {
            const {data,error} = await supabase
              .rpc("get_transaction_details");

            if(error){
              return {status:500,message:error.message,data:[]}
            }
            return {status:200,data:data};
        } catch (error) {
            console.error(error);
        }
    },

    addCustomer : async(input:dbCustomers) => {
      console.log(input)
      const {name,phone_number,address,cash_bon} = input
        try {
            const {data,error} = await supabase
              .from("customers")
              .upsert({
                name:name,
                phone_number:phone_number,
                address:address,
                cash_bon:cash_bon
              },{
                onConflict: "phone_number",
              })
              .select();

            if(error){
              return {status:500,message:error.message,data:[]}
            }
            return {status:200,message:"success",data:data}
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
              return {status:500,message:error.message};
            }
            return {status:200,data:data};
        } catch (error) {
            console.error(error);
        }
    },

    updateCustomer: async (input: dbCustomers) => {
        const { id, name, phone_number, address, cash_bon } = input;
        try {
            const { data, error } = await supabase
              .from("customers")
              .update({
                name: name,
                phone_number: phone_number,
                address: address,
                cash_bon: cash_bon
              })
              .eq("id", id)
              .select();
              
            if (error) {
                return { status: 500, message: error.message };
            }
            return { status: 200, data: data, message: "Customer updated successfully" };
        } catch (error) {
            console.error(error);
            return { status: 500, message: error };
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
                return {status:500,message:error.message}
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
          redirectTo: "http://localhost:5173/newPassword", // Customize this
        });
      
        if (error) {
          return {status:500,message:error.message}
        }
        return {status:200,message:'Password email sent'}
      },
      
      updatePassword:async(newPassword:string)=>{
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
      
        if (error) {
          return {message:error.message,status:500};
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