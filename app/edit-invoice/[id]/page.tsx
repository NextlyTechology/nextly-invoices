"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function EditInvoice() {
    const { id } = useParams();
    const router = useRouter();

    const [customer, setCustomer] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        const fetchInvoice = async () => {
            const { data } = await supabase
                .from("invoices")
                .select("*")
                .eq("id", id)
                .single();

            if (data) {
                setCustomer(data.customer);
                setAmount(data.amount);
            }
        };

        fetchInvoice();
    }, [id]);

    const handleUpdate = async () => {
        const { error } = await supabase
            .from("invoices")
            .update({
                customer,
                amount: Number(amount),
            })
            .eq("id", id);

        if (error) {
            alert("Error updating");
        } else {
            alert("Updated ✅");
            router.push("/");
        }
    };

    return (
        <main className="min-h-screen p-10">
            <h1 className="text-2xl font-bold mb-6">
                Edit Invoice
            </h1>

            <div className="bg-white p-6 rounded-xl shadow max-w-lg">
                <input
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="w-full border p-2 mb-4"
                />

                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border p-2 mb-4"
                />

                <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Update
                </button>
            </div>
        </main>
    );
}