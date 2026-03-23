import { Home, QrCode, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-2">
      {/* HOME */}
      <button
        onClick={() => navigate("/")}
        className={`flex flex-col items-center text-xs ${
          isActive("/") ? "text-red-500" : "text-gray-400"
        }`}
      >
        <Home className="w-5 h-5" />
        Home
      </button>

      {/* SCAN */}
      <button
        onClick={() => navigate("/scanner")}
        className={`flex flex-col items-center text-xs ${
          location.pathname.includes("/scanner")
            ? "text-red-500"
            : "text-gray-400"
        }`}
      >
        <QrCode className="w-5 h-5" />
        Scan
      </button>

      {/* PROFILE */}
      <button
        onClick={() => navigate("/profile")}
        className={`flex flex-col items-center text-xs ${
          isActive("/profile") ? "text-red-500" : "text-gray-400"
        }`}
      >
        <User className="w-5 h-5" />
        Profile
      </button>
    </div>
  );
}