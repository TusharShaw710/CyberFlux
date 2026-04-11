import { router } from './app.route';
import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useAuth } from './features/auth/hooks/useAuth';


function App() {
    const {handleGetMe}=useAuth();
    const {user}=useSelector((state)=>state.auth);
    
    useEffect(()=>{
      handleGetMe();
    },[]);
    
    console.log("Current user:",user); 
  return (
    <RouterProvider router={router} />
  )
}

export default App
