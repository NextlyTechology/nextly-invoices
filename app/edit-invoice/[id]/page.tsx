"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function EditInvoice() {
    const { id } = useParams();
    const router = useRouter();

    const [customer, setCustomer] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("pending");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInvoice = async () => {
            const { data, error } = await supabase
                .from("invoices")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                console.log(error);
            }

            if (data) {
                setCustomer(data.customer);
                setAmount(data.amount);
                setStatus(data.status || "pending");
            }
        };

        fetchInvoice();
    }, [id]);

    const handleUpdate = async () => {
        if (!customer || !amount) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);

        const { error } = await supabase
            .from("invoices")
            .update({
                customer,
                amount: Number(amount),
                status, // 🔥 أهم إضافة
            })
            .eq("id", id);

        setLoading(false);

        if (error) {
            alert("Error updating ❌");
            console.log(error);
        } else {
            alert("Updated ✅");
            router.push("/");
        }
    };

    return (
        <main className="min-h-screen p-10 bg-gray-50">
            <h1 className="text-2xl font-bold mb-6">
                Edit Invoice
            </h1>

            <div className="bg-white p-6 rounded-xl shadow max-w-lg">
                {/* Customer */}
                <input
                    placeholder="Customer Name"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="w-full border p-2 mb-4 rounded"
                />

                {/* Amount */}
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border p-2 mb-4 rounded"
                />

                {/* 🟣 Status */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border p-2 mb-4 rounded"
                >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                </select>

                {/* Button */}
                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                    {loading ? "Updating..." : "Update Invoice"}
                </button>
            </div>
        </main>
    );
}