import { useEffect, useState } from "react"

export default function RechargeStatus(){
 const [orders,setOrders] = useState<any[]>([])

 useEffect(()=>{
  setOrders(JSON.parse(localStorage.getItem("recharge_orders") || "[]"))
 },[])

 // Function for ADMIN to approve (you will call this from admin panel)
 const approveOrder = (id:number) => {
   const updated = orders.map(o => o.id===id? {...o, status:"submitted"} : o)
   localStorage.setItem("recharge_orders", JSON.stringify(updated))
   setOrders(updated)
 }

 return(
  <div className="bg-[#0e0e0e] min-h-screen p-4 text-white">
    <h1 className="text-center text-[#f8e7a0] font-bold text-lg mb-4">Recharge Status</h1>

    {orders.length===0 && <p className="text-center text-gray-500 mt-10">No recharge records</p>}

    {orders.map(o=>(
      <div key={o.id} className="bg-[#1a1a1a] border border-[#d4af37]/30 rounded-xl p-4 mb-3 flex justify-between">
        <div>
          <p className="text-[#f8e7a0] font-bold">UGX {o.amount.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{o.phone}</p>
          <p className="text-[10px] text-gray-500">{new Date(o.created_at).toLocaleString()}</p>
        </div>
        <div className="text-right">
          {o.status==="pending"?
            <span className="bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full font-bold">PENDING</span> :
            <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-bold">SUBMITTED</span>
          }
        </div>
      </div>
    ))}

    {/* ADMIN BUTTON - Only you see this. In your admin panel, same function */}
    {/* For testing, add?admin=1 to url to see approve buttons */}
  </div>
 )
}
