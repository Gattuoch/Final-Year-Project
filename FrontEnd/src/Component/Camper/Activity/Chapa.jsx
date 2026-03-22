import { useState } from "react";
import { Button, Input, Modal, Select, Result } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

export default function Chapa() {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, success: false, error: false });

  const [input, setInput] = useState({
    fName: "",
    lName: "",
    email: "",
    pNumber: "",
    amount: "",
    currency: "ETB",
  });

  const handleChange = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value });

  const submitPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tx_ref = uuidv4();

      const res = await fetch("http://localhost:5000/api/chapa/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: input.amount,
          currency: input.currency,
          email: input.email,
          first_name: input.fName,
          last_name: input.lName,
          phone_number: input.pNumber,
          tx_ref,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setModal({ open: false, success: true });
        setTimeout(() => {
          window.location.href = data.checkout_url;
        }, 1500);
      } else {
        setModal({ error: true });
      }
    } catch (err) {
      console.error(err);
      setModal({ error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Button type="primary" onClick={() => setModal({ open: true })}>
        Pay with Chapa
      </Button>

      <Modal open={modal.open} footer={null} onCancel={() => setModal({ open: false })}>
        <form onSubmit={submitPayment}>
          <Input name="fName" placeholder="First Name" prefix={<UserOutlined />} onChange={handleChange} required />
          <Input name="lName" className="mt-2" placeholder="Last Name" prefix={<UserOutlined />} onChange={handleChange} required />
          <Input name="email" className="mt-2" placeholder="Email" prefix={<MailOutlined />} onChange={handleChange} required />
          <Input name="pNumber" className="mt-2" placeholder="Phone" prefix={<PhoneOutlined />} onChange={handleChange} required />
          <Input name="amount" className="mt-2" placeholder="Amount" type="number" prefix={<MoneyCollectOutlined />} onChange={handleChange} required />

          <Select
            className="mt-2 w-full"
            value={input.currency}
            onChange={(v) => setInput({ ...input, currency: v })}
            options={[{ value: "ETB", label: "ETB" }]}
          />

          <Button
  type="primary"
  htmlType="submit"
  loading={loading}
  block
  className="mt-4 h-16 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg transition-all duration-300"
>
  Pay Now
</Button>

        </form>
      </Modal>

      <Modal open={modal.success} footer={null} closable={false}>
        <Result status="success" title="Redirecting to Chapa..." />
      </Modal>

      <Modal open={modal.error} onCancel={() => setModal({ error: false })} footer={null}>
        <Result status="error" title="Payment Failed" />
      </Modal>
    </div>
  );
}
