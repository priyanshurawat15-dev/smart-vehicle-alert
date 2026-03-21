import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types';
import { Car, AlertTriangle, Loader2 } from 'lucide-react';


export default function Scan() {
  const [isScanning, setIsScanning] = useState(true);

  const { qrCode } = useParams<{ qrCode: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!qrCode) {
        setError('Invalid QR code');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('qr_code', qrCode)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setError('Vehicle not found');
        } else {
          setVehicle(data);
        }
      } catch (err: any) {
        console.error('Error fetching vehicle:', err);
        setError('Failed to load vehicle information');
      } finally {
        setLoading(false);
      }

      setTimeout(() => {
      setIsScanning(false);
      }, 2000);
    };

    fetchVehicle();
  }, [qrCode]);


  if (isScanning) {
  return (
    <div className="bg-black text-white h-full flex flex-col justify-between p-6">

      <div className="text-center mt-6">
        <p className="text-lg font-medium">Scanning...</p>
        <p className="text-sm text-gray-400">
          Point your camera at the vehicle QR code
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-64 h-64 border-4 border-white rounded-xl flex items-center justify-center">
          <span className="text-gray-400">QR Area</span>
        </div>
      </div>

      <div className="flex justify-around mb-6 text-sm">
        <button className="text-gray-300">⚡ Flash</button>

        <button className="bg-red-500 px-6 py-2 rounded-full">
          Capture
        </button>

        <button
          onClick={() => navigate("/")}
          className="text-gray-300"
        >
          Cancel
        </button>
      </div>

    </div>
  );
}


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-slate-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading vehicle information...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Vehicle Not Found</h2>
          <p className="text-slate-600 mb-6">{error || 'The QR code you scanned is not registered in our system.'}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Vehicle Found 🌋</h2>
              <p className="text-sm text-slate-600">How can we help today?</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow space-y-4">

  {/* NUMBER PLATE */}
  <div className="text-center text-2xl font-bold tracking-widest">
    {vehicle.vehicle_number || "KA01XY1234"}
  </div>

  {/* VEHICLE INFO */}
  <div className="grid grid-cols-2 gap-3">
    <div className="bg-gray-100 p-3 rounded-lg text-sm">
      <p className="text-gray-500">Model</p>
      <p className="font-medium">{vehicle.model || "Honda City"}</p>
    </div>

    <div className="bg-gray-100 p-3 rounded-lg text-sm">
      <p className="text-gray-500">Color</p>
      <p className="font-medium">{vehicle.color || "White"}</p>
    </div>
  </div>

  {/* SAFETY STATUS */}
  <div className="flex items-center justify-between bg-green-100 p-3 rounded-lg">
    <p className="text-sm font-medium">Safety Status</p>
    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
      SAFE
    </span>
  </div>

  {/* CALL BUTTON */}
  <button
    onClick={() => navigate(`/emergency/${vehicle.id}`)}
    className="w-full bg-red-500 text-white py-3 rounded-xl font-medium"
  >
    📞 Call Owner (Masked)
  </button>

  {/* MESSAGE BUTTON */}
  <button
    onClick={() => navigate(`/alert/${vehicle.id}`)}
    className="w-full bg-red-500 text-white py-3 rounded-xl font-medium"
  >
    💬 Send Message
  </button>

  {/* INCIDENT */}
  <button
    onClick={() => navigate(`/incident/${vehicle.id}`)}
    className="w-full bg-red-500 text-white py-3 rounded-xl font-medium"
  >
    ⚠ Report Issue
  </button>

</div>

        <div className="mt-8 bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-medium text-slate-800 mb-2">Privacy Notice</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your report will be sent anonymously to the vehicle owner. No personal information will be shared, and the owner cannot see your identity or contact details.
          </p>
        </div>
      </div>
    </div>
  );
}
