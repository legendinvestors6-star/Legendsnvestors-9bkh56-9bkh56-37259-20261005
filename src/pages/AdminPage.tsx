import { useEffect, useState } from "react"

export default function AdminPage(){
 const [orders, setOrders] = useState<any[]>([])

 const load = ()=>{
  const data = JSON.parse(localStorage.getItem("recharge_orders") || "[]")
  console.log("Orders loaded:", data) // debug
  setOrders(data)
 }

 useEffect(()=>{
  load()
 },[])

 const approve = (id:number)=>{
  const order = orders.find((o:any)=>o.id===id)
  const updated = orders.map((o:any)=> o.id===id? {...o, status:"submitted"} : o)
  localStorage.setItem("recharge_orders", JSON.stringify(updated))
  setOrders(updated)
  alert(`Approved UGX ${order.amount}`)
 }

 const addTest = ()=>{
  const test = {
    id: Date.now(),
    amount: 30000,
    phone: "0770000000",
    status: "pending",
    created_at: new Date().toISOString()
  }
  const all = [test, ...orders]
  localStorage.setItem("recharge_orders", JSON.stringify(all))
  setOrders(all)
 }

 const clearAll = ()=>{
  if(confirm("Delete all?")){
    localStorage.removeItem("recharge_orders")
    setOrders([])
  }
 }

 return(
  <div className="bg-black min-h-screen p-4 text-white">
   <div className="max-w-md mx-auto">
    <h1 className="text-[#f8e7a0] font-bold text-center">ADMIN - All Recharges</h1>
    <p className="text-center text-gray-500 text-xs mt-1">{orders.length} total orders found</p>

    <div className="flex gap-2 mt-4">
      <button onClick={addTest} className="flex-1 bg-[#1a1a1a] border border-yellow-500/20 py-2 rounded-lg text-xs">+ Add Test Pending</button>
      <button onClick={load} className="flex-1 bg-[#1a1a1a] border border-yellow-500/20 py-2 rounded-lg text-xs">🔄 Refresh</button>
      <button onClick={clearAll} className="flex-1 bg-red-900/30 border border-red-500/20 py-2 rounded-lg text-xs text-red-300">Clear</button>
    </div>

    {orders.length===0 ? (
      <div className="bg-[#141414] border border-yellow-500/20 rounded-xl p-8 mt-6 text-center">
        <p className="text-gray-400 text-sm">Admin panel is empty because:</p>
        <p className="text-gray-500 text-xs mt-2">You did Recharge on different browser/phone</p>
        <p className="text-gray-500 text-xs">→ Click "Add Test Pending" to test Approve</p>
        <p className="text-yellow-500 text-xs mt-4">Or do a real recharge on THIS same browser, then come back here</p>
      </div>
    ) : (
      <div className="mt-6 space-y-3">
        {orders.map((o:any)=>(
          <div key={o.id} className="bg-[#141414] border border-[#d4af37]/20 rounded-xl p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-[#f8e7a0] font-bold">UGX {Number(o.amount).toLocaleString()}</p>
                <p className="text-xs text-gray-400">{o.phone} • {o.status}</p>
                <p className="text-[10px] text-gray-600">{new Date(o.created_at).toLocaleString()}</p>
              </div>
              <span className={`h-fit px-3 py-1 rounded-full text-[10px] font-bold ${o.status==="pending"?"bg-yellow-500/20 text-yellow-400":"bg-green-500/20 text-green-400"}`}>{o.status.toUpperCase()}</span>
            </div>
            {o.status==="pending" && (
              <button onClick={()=>approve(o.id)} className="w-full mt-3 bg-[#f8e7a0] text-black py-2 rounded-lg font-bold text-sm">Approve</button>
            )}
          </div>
        ))}
      </div>
    )}
   </div>
  </div>
 )
}
