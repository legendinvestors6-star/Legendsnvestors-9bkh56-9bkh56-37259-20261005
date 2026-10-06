import { useState } from "react";

export default function RechargePage() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");

  const handleRecharge = () => {
    if (!amount || !phone) {
      alert("Please enter amount and phone number");
      return;
    }
    if (Number(amount) < 30000) {
      alert("Minimum UGX 30,000");
      return;
    }
    alert(`Recharge UGX ${amount} for ${phone}`);
  };

  return (
    <div className="p-4 bg-[#f5f7fa] min-h-screen">
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h1 className="text-center font-bold text-lg">Recharge Account</h1>
        <p className="text-center text-sm text-gray-500 mb-4">Enter details to continue</p>

        <label className="font-semibold text-sm">Recharge Amount</label>
        <div className="flex mt-1 mb-1 bg-white rounded-xl border border-gray-300 items-center">
          <span className="px-4 py-3 font-bold text-sm text-gray-700">UGX</span>
          <input 
            value={amount} 
            onChange={(e)=>setAmount(e.target.value)} 
            placeholder="Enter amount" 
            type="number" 
            className="flex-1 bg-white outline-none p-3 text-sm text-black placeholder:text-gray-400" 
          />
        </div>
        <p className="text-xs text-gray-500 mb-4">Minimum: UGX 30,000</p>

        <label className="font-semibold text-sm">Phone Number</label>
        <div className="flex mt-1 mb-5 bg-white rounded-xl border border-gray-300 items-center">
          <span className="px-4 py-3">📱</span>
          <input 
            value={phone} 
            onChange={(e)=>setPhone(e.target.value)} 
            placeholder="Enter phone number" 
            type="tel" 
            className="flex-1 bg-white outline-none p-3 text-sm text-black placeholder:text-gray-400" 
          />
        </div>

        <div className="flex gap-3">
          <button onClick={handleRecharge} className="flex-1 bg-[#0d7ae5] text-white py-3 rounded-xl font-bold text-sm">
            Proceed to Recharge
          </button>
          <button onClick={()=>{setAmount(""); setPhone("");}} className="px-6 py-3 bg-white border rounded-xl text-sm">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
