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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      {/* CARD */}
      <div className="bg-white p-6 rounded-xl shadow w-[350px]">

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            className="w-12 h-12"
          />
        </div>

        {/* TITLE */}
        <h2 className="text-center text-lg font-semibold mb-4">
          Log into Vehicle qr systemm
        </h2>

        {/* EMAIL */}
        <input
          placeholder="Mobile number, username or id"
          className="border p-3 w-full mb-3 rounded-lg bg-gray-50"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-3 rounded-lg bg-gray-50"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="bg-blue-400 text-white p-3 w-full rounded-full mb-3 font-semibold"
        >
          Log in
        </button>

        {/* FORGOT */}
        <p className="text-center text-sm mb-4 cursor-pointer">
          Forgot password?
        </p>

        {/* DIVIDER */}
        <div className="flex items-center mb-4">
          <div className="flex-1 h-[1px] bg-gray-300"></div>
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        {/* SIGNUP BUTTON */}
        <button
          onClick={handleSignup}
          className="border border-blue-500 text-blue-500 p-3 w-full rounded-full font-semibold"
        >
          Create new account
        </button>

        {/* META */}
        <p className="text-center text-sm text-gray-400 mt-6">
         <b> Create account before login </b>
        </p>
        <p className="text-center text-sm text-gray-400 mt-6">
         <b> LOGIN PAGE </b>
        </p>

      </div>
    </div>
  );
}