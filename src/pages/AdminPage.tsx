import { useEffect, useState } from "react"

export default function RechargeStatus(){
 const [orders,setOrders] = useState<any[]>([])
 const [isAdmin,setIsAdmin] = useState(false)

 useEffect(()=>{
  const data = JSON.parse(localStorage.getItem("recharge_orders") || "[]")
  setOrders(data)

  // Check if admin: add?admin=1 to URL to see approve buttons
  const urlParams = new URLSearchParams(window.location.search)
  if(urlParams.get('admin') === '1'){
    setIsAdmin(true)
  }
  // If you have real admin login, use this instead:
  // const user = JSON.parse(localStorage.getItem("user") || "{}")
  // if(user.role === "admin") setIsAdmin(true)
 },[])

 const approve = (id:number)=>{
  const updated = orders.map(o=> o.id===id? {...o, status:"submitted"} : o)
  localStorage.setItem("recharge_orders", JSON.stringify(updated))
  setOrders(updated)
  alert("✅ Approved! User will now see SUBMITTED")
 }

 const reject = (id:number)=>{
  if(!confirm("Reject this recharge?")) return
  const updated = orders.map(o=> o.id===id? {...o, status:"rejected"} : o)
  localStorage.setItem("recharge_orders", JSON.stringify(updated))
  setOrders(updated)
 }

 return(
  <div className="bg-[#0a0a0a] min-h-screen p-4 text-white">
   <div className="max-w-md mx-auto">
    <h1 className="text-center text-[#f8e7a0] font-bold text-lg mb-1">Recharge Status</h1>
    <p className="text-center text-gray-500 text-xs mb-6">{isAdmin? "ADMIN MODE - You can approve" : "Your recharge records"}</p>

    {orders.length===0 && (
      <div className="text-center mt-20">
        <p className="text-gray-500 text-sm">No recharge records yet</p>
        <p className="text-gray-600 text-xs mt-1">Your pending recharges will appear here</p>
      </div>
    )}

    {orders.map((o:any)=>(
      <div key={o.id} className="bg-[#1a1a1a] border border-[#d4af37]/20 rounded-2xl p-4 mb-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#f8e7a0] font-bold text-[15px]">UGX {Number(o.amount).toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{o.phone}</p>
            <p className="text-[10px] text-gray-600 mt-1">{new Date(o.created_at).toLocaleString()}</p>
          </div>
          <div>
            {o.status==="pending" && <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] px-3 py-1 rounded-full font-bold">PENDING</span>}
            {o.status==="submitted" && <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] px-3 py-1 rounded-full font-bold">SUBMITTED</span>}
            {o.status==="rejected" && <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] px-3 py-1 rounded-full font-bold">REJECTED</span>}
          </div>
        </div>

        {/* ADMIN BUTTONS ONLY */}
        {isAdmin && o.status==="pending" && (
          <div className="flex gap-2 mt-3">
            <button onClick={()=>approve(o.id)} className="flex-1 bg-[#f8e7a0] text-black py-2 rounded-xl font-bold text-xs">✅ Approve</button>
            <button onClick={()=>reject(o.id)} className="flex-1 bg-[#2a1a1a] border border-red-500/50 text-red-400 py-2 rounded-xl font-bold text-xs">Reject</button>
          </div>
        )}
      </div>
    ))}

    {isAdmin && (
      <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <p className="text-yellow-300 text-[11px] text-center">You are in Admin Mode. Share normal link without?admin=1 to users.</p>
      </div>
    )}
   </div>
  </div>
 )
        }
