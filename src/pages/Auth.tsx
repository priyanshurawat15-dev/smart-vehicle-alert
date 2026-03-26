import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
  alert(error.message);
} else {
  alert("Login success 🔥");
  window.location.href = "/profile";
}
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert("Signup success 🎉");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Login / Signup</h2>

      <input
        placeholder="Email"
        className="border p-2 w-full mb-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        className="border p-2 w-full mb-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 w-full mb-2">
        Login
      </button>

      <button onClick={handleSignup} className="bg-green-500 text-white p-2 w-full">
        Signup
      </button>
    </div>
  );
}