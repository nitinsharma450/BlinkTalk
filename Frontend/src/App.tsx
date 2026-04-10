import { Route } from "react-router";
import { Routes } from "react-router";
import { BrowserRouter } from "react-router";
import Login from "./pages/loginSection/Login";
import { ToastContainer } from "react-toastify";


export default function App() {
  return (


    <>
     <ToastContainer
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

        <BrowserRouter>
   <Routes>
<Route element={<Login />} path="/login" />
    
   </Routes>
   
   
   </BrowserRouter>
    
    </>
 
  )
}
