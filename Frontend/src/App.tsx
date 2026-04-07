import { Route } from "react-router";
import { Routes } from "react-router";
import { BrowserRouter } from "react-router";
import Login from "./pages/loginSection/Login";



export default function App() {
  return (
   <BrowserRouter>
   <Routes>
<Route element={<Login />} path="/login" />
    
   </Routes>
   
   
   </BrowserRouter>
  )
}
