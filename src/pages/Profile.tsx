import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Profile() {

  const [user, setUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;

      console.log("USER:", currentUser);

      if (!currentUser) {
  setLoading(false);
  return;
}
      setUser(currentUser);

      const { data: profileData,error } = await supabase
         .from("profiles")
         .select("*")
         .eq("id", currentUser.id)
         .maybeSingle();

if (error) {
  console.log("PROFILE ERROR:", error);
}
if (!profileData)
   {

    const { error: insertError } = await supabase
  .from("profiles")
  .upsert({
    id: currentUser.id,
    name: "New User",
    phone: "",
  });

if (insertError) {
  console.log("INSERT ERROR:", insertError);
} else {
  console.log("INSERT SUCCESS ✅");
}

  setProfile({
    name: "New User",
    phone: "",
  });
} else {
  setProfile(profileData);
}

      const { data } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", currentUser.id);

      setVehicles(data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  if (!user && !loading) {
  return (
    <div className="p-4 text-center">
      <p>Please login first</p>
      <button
        onClick={() => (window.location.href = "/auth")}
        className="bg-blue-500 text-white p-2 mt-2"
      >
        Go to Login
      </button>
    </div>
  );
}

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      {/* TITLE */}
      <h2 className="text-xl font-bold text-center mb-4">
        My Account
      </h2>

      {/* PROFILE SECTION */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4">

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center">
          <img
            src="https://i.pravatar.cc/100"
            className="w-24 h-24 rounded-full border-4 border-gray-200"
          />
          <button className="text-blue-500 text-sm mt-2">
            Change Photo
          </button>
        </div>

        {/* USER DETAILS */}
        <div className="mt-4 space-y-2 text-center">
          <p className="font-semibold text-lg">
            {user?.user_metadata?.name || "Your Name"}
          </p>

          <p className="text-gray-500 text-sm">
            {user?.email}
          </p>

          <p className="text-gray-500 text-sm">
            +91 XXXXX XXXXX
          </p>
        </div>
      </div>

      {/* VEHICLES */}
      <h3 className="font-semibold mb-2">
        Registered Vehicles
      </h3>

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
              <p className="font-medium">
                {v.vehicle_number}
              </p>

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
          <span>📱 My QR Code</span>
          <span>›</span>
        </div>

        <div className="p-4 flex justify-between">
          <span>📄 Documents</span>
          <span>›</span>
        </div>

        <div className="p-4 flex justify-between">
          <span>🔔 Manage Notifications</span>
          <span>›</span>
        </div>

        <div className="p-4 flex justify-between">
          <span>🚨 Emergency Info</span>
          <span>›</span>
        </div>

        <div className="p-4 flex justify-between">
          <span>🔑 Change Password</span>
          <span>›</span>
        </div>

        <div className="p-4 flex justify-between">
          <span>❓ Help</span>
          <span>›</span>
        </div>

        <div className="p-4 flex justify-between">
          <span>💬 Support</span>
          <span>›</span>
        </div>

        <div className="p-4 flex justify-between">
          <span>🔒 Security Settings</span>
          <span>›</span>
        </div>

        <button
          onClick={handleLogout}
          className="p-4 text-red-500 w-full text-left"
        >
          🚪 Logout
        </button>
      </div>

    </div>
  );
}