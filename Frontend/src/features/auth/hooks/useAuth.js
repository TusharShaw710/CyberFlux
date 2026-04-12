import {login,register,GetUser} from "../services/auth.api";
import { setuser,setloading,seterror } from "../auth.slice";
import { useDispatch } from "react-redux";


export const useAuth=()=>{
    const dispatch=useDispatch();

    const handleRegister=async ({username,email,password})=>{
        dispatch(setloading(true));

        try{
            const response=await register({username,email,password});
            dispatch(setuser(response.user));
            return response.success;

        }catch(err){
            console.log(err);
            const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
            dispatch(seterror(errorMsg));
            return { success: false, error: errorMsg };
        }finally{
            dispatch(setloading(false));
        }
    }

    const handleLogin=async ({email,password})=>{
        dispatch(setloading(true));

        try{
            const response=await login({email,password});
            dispatch(setuser(response.user));
            return response.success;

        }catch(err){
            console.log(err);
            const errorMsg = err.response?.data?.message || "Login failed. Invalid credentials or network error.";
            dispatch(seterror(errorMsg));
            return { success: false, error: errorMsg };
        }finally{
            dispatch(setloading(false));
        } 

    }

    const handleGetMe=async()=>{
        dispatch(setloading(true));

        try{
            const response=await GetUser();
            dispatch(setuser(response.user));

        }catch(err){
            console.log(err);
            dispatch(seterror(err.message || "Error fetching user data"));
        }finally{
            dispatch(setloading(false));
        }
    }

    return {handleRegister,handleLogin,handleGetMe};
}

