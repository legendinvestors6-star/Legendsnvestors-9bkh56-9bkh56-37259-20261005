import * as React from "react";
const AdminPage = () => {
  const [orders, setOrders] = React.useState<any[]>([]);

  React.useEffect(() => {
    const data = localStorage.getItem("recharge_orders");
    if (data) setOrders(JSON.parse(data));
  }, []);

  return (
    <div style={{ background: 'black', minHeight: '100vh', padding: 16, color: 'white' }}>
      <h1 style={{ color: '#f8e7a0', textAlign: 'center' }}>ADMIN - All Recharges</h1>
      <p style={{ textAlign: 'center', fontSize: 12 }}>{orders.length} orders</p>
      {orders.map((o: any) => (
        <div key={o.id} style={{ background: '#141414', padding: 12, marginTop: 12, borderRadius: 12 }}>
          <p>UGX {o.amount} - {o.status}</p>
          <p style={{ fontSize: 11 }}>{o.phone}</p>
        </div>
      ))}
      {orders.length === 0 && <p style={{ textAlign: 'center', marginTop: 40, color: 'gray' }}>No orders. Do recharge on same browser.</p>}
    </div>
  );
};
export default AdminPage;
