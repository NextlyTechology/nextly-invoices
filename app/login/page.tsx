"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            alert("Login failed ❌");
        } else {
            router.push("/");
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-6 rounded-xl shadow w-80">
                <h1 className="text-xl font-bold mb-4 text-center">
                    Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 mb-3 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 mb-3 rounded"
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* 🟣 Register Link */}
                <p className="text-sm text-center mt-4">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="text-blue-600 font-medium"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </main>
    );
}