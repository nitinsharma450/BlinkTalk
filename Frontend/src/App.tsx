import { Route } from "react-router";
import { Routes } from "react-router";
import { BrowserRouter } from "react-router";


export default function App() {
  return (
   <BrowserRouter>
   <Routes>
<Route element={<login />} path="/login" />
    
   </Routes>
   
   
   </BrowserRouter>
  )
}
