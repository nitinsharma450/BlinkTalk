import { Route } from "react-router";
import { Routes } from "react-router";
import { BrowserRouter } from "react-router";
import Login from "./pages/loginSection/Login";
import { ToastContainer } from "react-toastify";
import { ProtectedRoute, PublicRoute } from "./protected";
import Homepage from "./component/HomePage";
import Status from "./pages/statusSection/Status";
import Setting from "./pages/settingPage/Setting";


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

    <Route element={<PublicRoute />}>
     <Route element={<Login />} path="/login" />
    </Route>

    <Route element={<ProtectedRoute />}>
   <Route path="/" element={<Homepage />} />
   <Route  path="/status" element={<Status />}/ >
   <Route path="/settings" element={<Setting />}/>
    </Route>

    
   </Routes>
   
   
   </BrowserRouter>
    
    </>
 
  )
}
