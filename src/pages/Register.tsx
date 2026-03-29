import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { generateUniqueCode, getQRCodeUrl, getScanUrl } from '../utils/qrcode';
import { Download, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface EmergencyContactForm {
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  relationship: string;
  priority: number;
}

export default function Register() {
  const navigate = useNavigate();

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactForm[]>([
    { contact_name: '', contact_phone: '', contact_email: '', relationship: '', priority: 1 }
  ]);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [, setVehicleId] = useState<string | null>(null);

  // ➕ Add contact
  const addEmergencyContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { contact_name: '', contact_phone: '', contact_email: '', relationship: '', priority: emergencyContacts.length + 1 }
    ]);
  };

  // ❌ Remove contact
  const removeEmergencyContact = (index: number) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
    }
  };

  // ✏️ Update contact
  const updateEmergencyContact = (index: number, field: keyof EmergencyContactForm, value: string | number) => {
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    setEmergencyContacts(updated);
  };

  // 🚀 SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ LOGIN CHECK (IMPORTANT)
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      alert("⚠️ Please login first");
      navigate("/auth");
      return;
    }

    if (!vehicleNumber.trim()) {
      alert('Please enter vehicle number');
      return;
    }

    const validContacts = emergencyContacts.filter(
      c => c.contact_name.trim() && c.contact_phone.trim()
    );

    if (validContacts.length === 0) {
      alert('Please add at least one emergency contact');
      return;
    }

    setLoading(true);

    try {
      const uniqueQrCode = generateUniqueCode();

      // 🚗 check if already exists
      const { data: existingVehicle } = await supabase
        .from("vehicles")
        .select("*")
        .eq("vehicle_number", vehicleNumber.trim())
        .maybeSingle();

      if (existingVehicle) {
        alert("🚗 Vehicle already registered!");
        navigate(`/scan/${existingVehicle.qr_code}`);
        return;
      }

      // 🚗 insert vehicle
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
          qr_code: uniqueQrCode,
          vehicle_number: vehicleNumber.trim(),
          owner_name: ownerName.trim() || null,
          owner_email: ownerEmail.trim() || null,
          user_id: user.id, // 🔥 important
        })
        .select()
        .single();

      if (vehicleError) throw vehicleError;

      // 📞 insert contacts
      const contactsToInsert = validContacts.map(contact => ({
        vehicle_id: vehicle.id,
        contact_name: contact.contact_name.trim(),
        contact_phone: contact.contact_phone.trim(),
        contact_email: contact.contact_email.trim() || null,
        relationship: contact.relationship.trim(),
        priority: contact.priority
      }));

      const { error: contactsError } = await supabase
        .from('emergency_contacts')
        .insert(contactsToInsert);

      if (contactsError) throw contactsError;

      // ✅ success
      setQrCode(uniqueQrCode);
      setVehicleId(vehicle.id);

    } catch (error: any) {
      console.error(error);
      alert('❌ Failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ⬇️ DOWNLOAD QR
  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = getQRCodeUrl(qrCode);
    link.download = `qr-${vehicleNumber}.png`;
    link.click();
  };

  // 🔄 RESET
  const resetForm = () => {
    setVehicleNumber('');
    setOwnerName('');
    setOwnerEmail('');
    setEmergencyContacts([
      { contact_name: '', contact_phone: '', contact_email: '', relationship: '', priority: 1 }
    ]);
    setQrCode(null);
    setVehicleId(null);
  };

  // 🎉 SUCCESS SCREEN
  if (qrCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow text-center">

          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />

          <h2 className="text-xl font-semibold mb-2">
            Vehicle Registered ✅
          </h2>

          <img src={getQRCodeUrl(qrCode)} className="w-60 mx-auto my-4" />

          <button
            onClick={downloadQRCode}
            className="bg-black text-white px-4 py-2 rounded-lg mr-2"
          >
            Download QR
          </button>

          <button
            onClick={resetForm}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            Add Another
          </button>

          <p className="text-xs mt-4 break-all">
            {getScanUrl(qrCode)}
          </p>

        </div>
      </div>
    );
  }

  // 🧾 FORM UI (same as yours)
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-xl font-bold mb-4">Register Vehicle</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Vehicle Number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="Owner Email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            className="w-full p-3 border rounded"
          />

          {emergencyContacts.map((c, i) => (
            <div key={i} className="border p-3 rounded space-y-2">
              <input
                placeholder="Name"
                value={c.contact_name}
                onChange={(e) => updateEmergencyContact(i, "contact_name", e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                placeholder="Phone"
                value={c.contact_phone}
                onChange={(e) => updateEmergencyContact(i, "contact_phone", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}

          <button type="button" onClick={addEmergencyContact}>
            + Add Contact
          </button>

          <button
            type="submit"
            className="w-full bg-red-500 text-white p-3 rounded"
          >
            {loading ? "Saving..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
}