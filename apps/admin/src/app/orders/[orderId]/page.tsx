export default function OrderDetail({ params }: { params: { orderId: string } }) {
  return <div>Order {params.orderId}</div>;
}
