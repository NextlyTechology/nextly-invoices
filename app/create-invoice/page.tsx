"use client";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function CreateInvoice() {
    const [customer, setCustomer] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("pending");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!customer || !amount) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);

        // 🟢 نجيب اليوزر الحالي
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("You must be logged in");
            setLoading(false);
            return;
        }

        const { error } = await supabase.from("invoices").insert([
            {
                customer: customer,
                amount: Number(amount),
                status: status,
                user_id: user.id, // 🔥 أهم سطر
            },
        ]);

        setLoading(false);

        if (error) {
            alert("Error saving invoice");
            console.log(error);
        } else {
            alert("Invoice saved successfully ✅");

            setCustomer("");
            setAmount("");
            setStatus("pending");
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 p-10">
            <h1 className="text-2xl font-bold mb-6">
                Create Invoice
            </h1>

            <div className="bg-white p-6 rounded-xl shadow max-w-lg">
                <div className="mb-4">
                    <label className="block mb-1 font-medium">
                        Customer Name
                    </label>
                    <input
                        type="text"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">
                        Amount (EGP)
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
                >
                    {loading ? "Saving..." : "Save Invoice"}
                </button>
            </div>
        </main>
    );
}