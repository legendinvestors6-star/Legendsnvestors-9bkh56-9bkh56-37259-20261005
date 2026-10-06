import { BrowserRouter, Routes, Route } from "react-router-dom"
import RechargePage from "./pages/Recharge" // your user page
import AdminPage from "./pages/AdminPage" // your admin page

function App(){
  return(
    <BrowserRouter>
      <Routes>
        {/* User website - when you open bkh56...vercel.app */}
        <Route path="/" element={<RechargePage />} />
        <Route path="/recharge" element={<RechargePage />} />
        
        {/* Admin - only when you open /admin */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
