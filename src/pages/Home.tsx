import { useNavigate } from 'react-router-dom';
import { Car, QrCode, Shield, AlertTriangle } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
<div className="flex justify-between items-center mb-6">
  <h1 className="text-lg font-semibold flex items-center gap-2">
    <QrCode className="w-5 h-5" />
    QR Safe
  </h1>
  <span className="text-xl">🔔</span>
</div>

{/* TITLE */}
<div className="mb-6">
  <h2 className="text-2xl font-bold leading-tight">
    Vehicle Safety <br /> Made Simple
  </h2>
</div>
      <div className="max-w-4xl mx-auto px-4 py-10 pb-24">



        </div>
        
        <div className="space-y-4 mb-8">

  {/* SCAN CARD */}
  <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
    <div className="bg-gray-100 p-3 rounded-xl">
      <QrCode className="w-8 h-8" />
    </div>

    <div className="flex-1">
      <p className="text-sm text-gray-500">Scan QR Code</p>
      <h3 className="font-semibold text-lg">Scan Vehicle QR</h3>
      <p className="text-xs text-gray-500">
        Connect securely without sharing personal data
      </p>

      <button
        onClick={() => navigate("/scan/demo")}
        className="mt-2 bg-red-500 text-white px-4 py-1 rounded-full text-sm"
      >
        Scan Now
      </button>
    </div>
  </div>

  {/* REGISTER CARD */}
  <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
    <div className="bg-gray-100 p-3 rounded-xl">
      <Car className="w-8 h-8" />
    </div>

    <div className="flex-1">
      <p className="text-sm text-gray-500">Register Vehicle</p>
      <h3 className="font-semibold text-lg">Register Your Vehicle</h3>
      <p className="text-xs text-gray-500">
        Protect your privacy & enable safe communication
      </p>

      <button
        onClick={() => navigate("/register")}
        className="mt-2 border border-red-500 text-red-500 px-4 py-1 rounded-full text-sm"
      >
        Get QR Code
      </button>
    </div>
  </div>

          <button
            onClick={() => navigate('/register')}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md hover:border-slate-300 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-slate-700 transition-colors">
                <QrCode className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Register Your Vehicle</h3>
                <p className="text-slate-600 leading-relaxed">
                  Generate a unique QR code for your vehicle and add emergency contacts for enhanced safety.
                </p>
                <span className="inline-block mt-4 text-slate-800 font-medium group-hover:gap-2 transition-all">
                  Get Started →
                </span>
              </div>
            </div>
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <QrCode className="w-7 h-7 text-slate-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Scanned a QR Code?</h3>
                <p className="text-slate-600 leading-relaxed">
                  If you scanned a QR code from a vehicle, you should already see the options page.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-8">
  <h2 className="text-lg font-semibold mb-4">How It Works</h2>

  <div className="flex justify-between text-center text-sm text-gray-600">
    
    <div>
      <QrCode className="mx-auto mb-1" />
      Scan QR
    </div>

    <div>→</div>

    <div>
      <Car className="mx-auto mb-1" />
      Action
    </div>

    <div>→</div>

    <div>
      📞 <br />
      Contact
    </div>

  </div>
</div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Wrong Parking Alerts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Get notified when your vehicle is blocking access or parked incorrectly.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-700" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Emergency Assistance</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Emergency contacts are automatically notified with GPS location during emergencies.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Car className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Incident Reports</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Receive detailed reports with photos of any damage or incidents involving your vehicle.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-slate-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-white mb-3">Privacy First</h2>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your personal information is never exposed. All communication is anonymous, and your phone number remains private. Only emergency contacts you specify will be notified when needed.
          </p>
        </div>
      </div>
  );
}
