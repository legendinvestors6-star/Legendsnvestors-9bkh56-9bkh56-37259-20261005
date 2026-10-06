import { useState } from "react"

export default function Recharge(){
 const [amount,setAmount]=useState("")
 const [phone,setPhone]=useState("")
 const MIN = 30000
 const quick = [30000,50000,100000,200000]
 const isValid = Number(amount) >= MIN && phone.length >= 10

 const pay = () => {
  if(!isValid) return
  const order = {
    id: Date.now(),
    amount: Number(amount),
    phone: phone,
    status: "pending",
    created_at: new Date().toISOString()
  }
  const all = JSON.parse(localStorage.getItem("recharge_orders") || "[]")
  all.unshift(order)
  localStorage.setItem("recharge_orders", JSON.stringify(all))
  window.location.href = "/recharge-status"
 }

 return(
  <div className="bg-[#080808] min-h-screen p-4 pb-20">
   <div className="max-w-md mx-auto space-y-4">

    {/* Header Card */}
    <div className="bg-[#141414] border border-[#d4af37]/30 rounded-[18px] p-4 text-center">
      <h1 className="text-[#f8e7a0] font-bold text-[16px]">Recharge Account</h1>
      <p className="text-gray-500 text-xs mt-1">Enter details to continue</p>
    </div>

    {/* Amount Card */}
    <div className="bg-[#141414] border border-[#d4af37]/30 rounded-[18px] p-4">
      <h2 className="text-[#f8e7a0] text-[13px] font-bold mb-3">Recharge Amount</h2>
      <div className="flex items-center bg-[#0e0e0e] border border-[#2a2a2a] rounded-xl px-4">
        <span className="text-[#f8e7a0] font-bold text-[13px]">UGX</span>
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Enter amount" type="number" className="flex-1 bg-transparent p-3.5 outline-none text-white placeholder:text-gray-500 text-[14px]" />
      </div>
      <p className="text-[#a09560] text-[11px] mt-2">Minimum: UGX 30,000 •</p>
      <div className="flex gap-2 mt-3">
        {quick.map(v=>(
          <button key={v} onClick={()=>setAmount(v.toString())} className={`px-4 py-1.5 rounded-full text-xs font-bold border ${Number(amount)===v? "bg-[#f8e7a0] text-black border-[#f8e7a0]" : "bg-[#2a2515] text-[#f8e7a0] border-[#d4af37]/20"}`}>
            {v===100000?"100k": v===200000?"200k": v===50000?"50k":"30k"}
          </button>
        ))}
      </div>
    </div>

    {/* Phone Card */}
    <div className="bg-[#141414] border border-[#d4af37]/30 rounded-[18px] p-4">
      <h2 className="text-[#f8e7a0] text-[13px] font-bold mb-3">Phone Number</h2>
      <div className="flex items-center bg-[#0e0e0e] border border-[#2a2a2a] rounded-xl px-4">
        <span className="text-[18px]">📱</span>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Enter phone number" type="tel" className="flex-1 bg-transparent p-3.5 outline-none text-white placeholder:text-gray-500 text-[14px]" />
      </div>
      <button disabled={!isValid} onClick={pay} className={`w-full mt-4 py-3 rounded-xl font-bold text-[14px] transition-all ${isValid? "bg-gradient-to-b from-[#f8e7a0] to-[#d4af37] text-black" : "bg-[#2a2f3a] text-gray-400"}`}>
        Proceed to Recharge
      </button>
    </div>

    {/* Instructions Card */}
    <div className="bg-[#141414] border border-[#d4af37]/30 rounded-[18px] p-4">
      <h2 className="text-[#f8e7a0] text-[13px] font-bold mb-3 flex items-center gap-2">⚠️ Recharge Instructions</h2>
      <div className="space-y-2 text-[12px]">
        <p className="text-gray-300"><span className="text-green-500">✅</span> Minimum recharge: <span className="text-[#f8e7a0] font-bold">UGX 30,000</span></p>
        <p className="text-gray-400"><span className="text-green-500">✅</span> You can use <span className="text-white font-bold">any phone number</span> to deposit</p>
        <p className="text-gray-400"><span className="text-green-500">✅</span> You can deposit multiple times</p>
        <p className="text-gray-400"><span className="text-green-500">✅</span> Create new order for every payment</p>
        <p className="text-gray-400">🕒 Allow 2-5 minutes after transfer</p>
      </div>
    </div>

   </div>
  </div>
 )
                                                                                            }
