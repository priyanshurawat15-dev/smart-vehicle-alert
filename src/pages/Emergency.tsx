import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Phone, MapPin, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const EMERGENCY_SERVICES = [
  { name: 'Ambulance', number: '108', icon: '🚑', color: 'bg-red-100 text-red-700' },
  { name: 'Police', number: '100', icon: '🚓', color: 'bg-blue-100 text-blue-700' },
  { name: 'Fire Brigade', number: '101', icon: '🚒', color: 'bg-orange-100 text-orange-700' },
  { name: 'Women Helpline', number: '1091', icon: '👮‍♀️', color: 'bg-purple-100 text-purple-700' },
  { name: 'Disaster Management', number: '108', icon: '⚠️', color: 'bg-yellow-100 text-yellow-700' }
];

export default function Emergency() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Failed to get your location. Emergency services will still be notified.');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleActivateEmergency = async () => {
    if (!location) {
      alert('Please wait while we get your location or try again');
      return;
    }

    setLoading(true);

    try {
      const emergencyData = {
        vehicle_id: vehicleId,
        location_lat: location.lat,
        location_lng: location.lng,
        activation_note: note.trim() || null,
        contacts_notified: []
      };

      const { error } = await supabase
        .from('emergency_activations')
        .insert(emergencyData);

      if (error) throw error;

      setSuccess(true);
    } catch (error: any) {
      console.error('Error activating emergency:', error);
      alert('Failed to activate emergency mode: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openMapsWithLocation = () => {
    if (!location) return;
    const mapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    window.open(mapsUrl, '_blank');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Emergency Activated</h2>
          <p className="text-slate-600 mb-6">
            Emergency contacts have been notified with your location. Help is on the way.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 font-medium">
              If you need immediate assistance, please call emergency services using the numbers provided.
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-slate-100 p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-700" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Emergency Assistance</h1>
              <p className="text-sm text-slate-600">Immediate help and support</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 leading-relaxed">
              <strong>Emergency Mode Activated:</strong> Your location will be shared with the vehicle owner's emergency contacts. For immediate help, call emergency services below.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-slate-600" />
            Your Location
          </h2>

          {gettingLocation ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-2" />
                <p className="text-sm text-slate-600">Getting your location...</p>
              </div>
            </div>
          ) : location ? (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium mb-2">Location captured successfully</p>
                <p className="text-xs text-green-700 font-mono">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
              <button
                onClick={openMapsWithLocation}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-2.5 px-4 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                View on Google Maps
              </button>
              <button
                onClick={handleGetLocation}
                className="w-full bg-slate-100 text-slate-700 py-2.5 px-4 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                Refresh Location
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-slate-600 mb-4">Unable to get your location</p>
              <button
                onClick={handleGetLocation}
                className="bg-slate-800 text-white py-2.5 px-6 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-slate-600" />
            Emergency Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EMERGENCY_SERVICES.map((service, index) => (
              <a
                key={index}
                href={`tel:${service.number}`}
                className={`${service.color} rounded-lg p-4 hover:opacity-80 transition-opacity`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{service.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{service.name}</p>
                    <p className="text-lg font-bold">{service.number}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 text-lg mb-4">Additional Notes</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe the emergency situation (optional)..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleActivateEmergency}
            disabled={loading || !location}
            className="w-full bg-red-600 text-white py-4 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? 'Notifying Contacts...' : 'Notify Emergency Contacts'}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-slate-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="font-medium text-slate-800 mb-2 text-sm">Important Instructions</h4>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li>• hello use our vehicle qr code to quiclky access important details of owner </li>
            <li>• Only use this system in genuine case only </li>
            <li>• If the situation is serious , call emergency service provided in our system</li>
            <li>• Provide clear location details when calling for help</li>
            
          </ul>
        </div>
      </div>
    </div>
  );
}
