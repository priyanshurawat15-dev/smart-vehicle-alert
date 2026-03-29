import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;

        console.log("USER:", currentUser);

        if (!currentUser) {
          window.location.href = "/auth";
          return;
        }

        setUser(currentUser);

        const { data, error } = await supabase
          .from("vehicles")
          .select("*")
          .eq("user_id", currentUser.id);

        console.log("VEHICLES:", data);

        if (error) console.log("Supabase error:", error);

        setVehicles(data || []);
      } catch (err) {
        console.log("ERROR:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="p-4">Loading ho raha hai...</p>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col justify-between">

      {/* 🔼 TOP CONTENT */}
      <div>

        <h2 className="text-xl font-bold text-center mb-4">My Account</h2>

        {/* PROFILE */}
        <div className="bg-white p-4 rounded-2xl shadow mb-4">
          <div className="flex flex-col items-center">
            <img
              src="https://i.pravatar.cc/100"
              className="w-24 h-24 rounded-full border-4 border-gray-200"
            />
            <button className="text-blue-500 text-sm mt-2">
              Change Photo
            </button>
          </div>

          <div className="mt-4 space-y-2 text-center">
            <p className="font-semibold text-lg">
              {user?.user_metadata?.name || "Your Name"}
            </p>

            <p className="text-gray-500 text-sm">{user?.email}</p>
            <p className="text-gray-500 text-sm">+91 XXXXX XXXXX</p>
          </div>
        </div>

        {/* VEHICLES */}
        <h3 className="font-semibold mb-2">Registered Vehicles</h3>

        <div className="space-y-3 mb-4">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white p-3 rounded-xl shadow flex gap-3"
            >
              <img
                src="https://via.placeholder.com/100"
                className="w-20 h-20 rounded object-cover"
              />

              <div>
                <p className="font-medium">{v.vehicle_number}</p>
                <p className="text-sm text-gray-500">
                  {v.vehicle_type || "Car"}
                </p>
                <p className="text-sm text-gray-500">
                  {v.model_name || "Model Name"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SETTINGS */}
        <div className="bg-white rounded-2xl shadow divide-y">
          <div className="p-4 flex justify-between">
            <span>My QR Code</span>
            <span>›</span>
          </div>

          <div className="p-4 flex justify-between">
            <span>Documents</span>
            <span>›</span>
          </div>

          <div className="p-4 flex justify-between">
            <span>Manage Notifications</span>
            <span>›</span>
          </div>

          <div className="p-4 flex justify-between">
            <span>Emergency Info</span>
            <span>›</span>
          </div>

          <div className="p-4 flex justify-between">
            <span>Change Password</span>
            <span>›</span>
          </div>

          <div className="p-4 flex justify-between">
            <span>Help & Support</span>
            <span>›</span>
          </div>

          <div className="p-4 flex justify-between">
            <span>Support</span>
            <span>›</span>
          </div>
        </div>

      </div>

      {/* 🔻 LOGOUT (BOTTOM FIXED STYLE) */}
      <button
        onClick={handleLogout}
        className="p-4 text-red-500 w-full text-left bg-white rounded-xl shadow mt-4"
      >
        🚪 Logout
      </button>

    </div>
  );
}