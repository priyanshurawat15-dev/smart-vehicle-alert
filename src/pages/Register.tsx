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

  const addEmergencyContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { contact_name: '', contact_phone: '', contact_email: '', relationship: '', priority: emergencyContacts.length + 1 }
    ]);
  };

  const removeEmergencyContact = (index: number) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
    }
  };

  const updateEmergencyContact = (index: number, field: keyof EmergencyContactForm, value: string | number) => {
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    setEmergencyContacts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    

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

      const { data: vehicle, error: vehicleError } = await supabase
      
        .from('vehicles')
        .insert({

          qr_code: uniqueQrCode,
          vehicle_number: vehicleNumber.trim(),
          owner_name: ownerName.trim() || null,
          owner_email: ownerEmail.trim() || null,
          
          user_id: user?.id,
        })
        .select()
        .single();

        console.log("USER:", user);
console.log("VEHICLE ERROR:", vehicleError);
console.log("VEHICLE DATA:", vehicle);


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

      setQrCode(uniqueQrCode);
      setVehicleId(vehicle.id);
    } catch (error: any) {
      console.error('Error registering vehicle:', error);
      alert('Failed to register vehicle: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = getQRCodeUrl(qrCode);
    link.download = `qr-code-${vehicleNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  if (qrCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">Registration Successful!</h2>
            <p className="text-slate-600">Your vehicle has been registered successfully.</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 mb-6">
            <div className="flex justify-center mb-4">
              <img
                src={getQRCodeUrl(qrCode)}
                alt="Vehicle QR Code"
                className="w-64 h-64 rounded-lg shadow-md"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">QR Code ID</p>
              <p className="text-lg font-mono font-semibold text-slate-800 break-all">{qrCode}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Important : </strong> This is your QR code , Print it & paste this in your vehicle windsheild or dashboard for easy scanning.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={downloadQRCode}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Download QR Code
            </button>
            <button
              onClick={resetForm}
              className="w-full bg-slate-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              Register Another Vehicle
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-600 mb-2"><strong>Scan URL:</strong></p>
            <p className="text-xs font-mono text-slate-800 break-all">{getScanUrl(qrCode)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-6 shadow">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-6">
  Register Your Vehicle
</h1>
            <p className="text-slate-600">Register your vehicle and set up emergency contacts for QR-based assistance</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-slate-800 text-lg">Vehicle Information</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vehicle Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g., MH12AB1234"
                  className="w-full px-4 py-2.5 border-b border-slate-300 rounded none bg-transparent focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Owner Name <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 border-b border-slate-300 rounded none bg-transparent focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 border-b border-slate-300 rounded none bg-transparent focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 text-lg">Emergency Contacts</h3>
                <button
                  type="button"
                  onClick={addEmergencyContact}
                  className="flex items-center gap-1 text-sm text-slate-700 hover:text-slate-900 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Contact
                </button>
              </div>

              {emergencyContacts.map((contact, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Contact {index + 1}</span>
                    {emergencyContacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmergencyContact(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        value={contact.contact_name}
                        onChange={(e) => updateEmergencyContact(index, 'contact_name', e.target.value)}
                        placeholder="Contact Name *"
                        className="w-full px-3 py-2 border-b border-slate-300 rounded none bg-transparent focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={contact.contact_phone}
                        onChange={(e) => updateEmergencyContact(index, 'contact_phone', e.target.value)}
                        placeholder="Phone Number *"
                        className="w-full px-3 py-2 border-b border-slate-300 rounded none bg-transparent focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        value={contact.contact_email}
                        onChange={(e) => updateEmergencyContact(index, 'contact_email', e.target.value)}
                        placeholder="Email (Optional)"
                        className="w-full px-3 py-2 border-b border-slate-300 rounded none bg-transparent focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={contact.relationship}
                        onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                        placeholder="Relationship *"
                        className="w-full px-3 py-2 border-b border-slate-300 rounded none bg-transparent focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-4 rounded-xl font-semibold text-lg shadow-md active:scale-95 transition"
            >
              {loading ? 'Registering...' : 'Submit Vehicle Details'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Need help? <a href="/" className="text-slate-800 hover:underline font-medium">Back to Home</a>
          </p>
        </div>
      </div>
    </div>
  );
}
