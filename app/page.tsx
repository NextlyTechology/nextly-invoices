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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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
    doc.text(`Due Date: ${inv.due_date}`, 20, 70);

    const today = new Date().toLocaleDateString();
    doc.text(`Date: ${today}`, 20, 80);

    doc.save(`invoice-${inv.id}.pdf`);
  };

  // 🔴 Overdue logic
  const today = new Date();

  const isOverdue = (inv: any) => {
    return (
      inv.status === "pending" &&
      inv.due_date &&
      new Date(inv.due_date) < today
    );
  };

  // 🧠 Stats
  const totalAmount = invoices.reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  );

  const paidAmount = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  const pendingAmount = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  const overdueAmount = invoices
    .filter((inv) => isOverdue(inv))
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

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
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
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

        {/* 🟢 Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Total</p>
            <h3 className="text-xl font-bold">
              EGP {totalAmount}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Paid</p>
            <h3 className="text-xl font-bold text-green-600">
              EGP {paidAmount}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Pending</p>
            <h3 className="text-xl font-bold text-yellow-600">
              EGP {pendingAmount}
            </h3>
          </div>

          {/* 🔴 Overdue */}
          <div className="bg-white p-5 rounded-xl shadow border border-red-500">
            <p className="text-red-500">Overdue</p>
            <h3 className="text-xl font-bold text-red-600">
              EGP {overdueAmount}
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
                <th className="py-2">Due Date</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className={`border-b ${isOverdue(inv) ? "bg-red-50" : ""
                    }`}
                >
                  <td className="py-2">{inv.customer}</td>
                  <td className="py-2">EGP {inv.amount}</td>
                  <td className="py-2">{inv.due_date}</td>

                  <td className="py-2">
                    <span
                      className={`px-3 py-1 rounded text-white text-sm ${isOverdue(inv)
                        ? "bg-red-500"
                        : inv.status === "paid"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                        }`}
                    >
                      {isOverdue(inv) ? "overdue" : inv.status}
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