"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";

export default function Home() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const router = useRouter();

  const fetchInvoices = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 🔴 لو مش مسجل دخول
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.log(error);
    } else {
      setInvoices(data || []);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error deleting");
      console.log(error);
    } else {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    }
  };

  // 🟣 PDF
  const downloadPDF = (inv: any) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Nextly Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Customer: ${inv.customer}`, 20, 40);
    doc.text(`Amount: EGP ${inv.amount}`, 20, 50);
    doc.text(`Status: ${inv.status}`, 20, 60);

    const today = new Date().toLocaleDateString();
    doc.text(`Date: ${today}`, 20, 70);

    doc.save(`invoice-${inv.id}.pdf`);
  };

  // 🔓 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const totalInvoices = invoices.length;

  const totalAmount = invoices.reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="w-full bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">
          Nextly
        </h1>

        <div className="flex gap-2">
          <Link href="/create-invoice">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
              + New Invoice
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard */}
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-4">
          Dashboard
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Total Invoices</p>
            <h3 className="text-xl font-bold">
              {totalInvoices}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Total Amount</p>
            <h3 className="text-xl font-bold text-green-600">
              EGP {totalAmount}
            </h3>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8 bg-white p-5 rounded-xl shadow">
          <h3 className="font-bold mb-4">Invoices</h3>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Customer</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b">
                  <td className="py-2">{inv.customer}</td>
                  <td className="py-2">EGP {inv.amount}</td>

                  <td className="py-2">
                    <span
                      className={`px-3 py-1 rounded text-white text-sm ${inv.status === "paid"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                        }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-2 flex gap-2">
                    <Link href={`/edit-invoice/${inv.id}`}>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded">
                        Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => downloadPDF(inv)}
                      className="bg-purple-500 text-white px-3 py-1 rounded"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}