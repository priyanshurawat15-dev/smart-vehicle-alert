import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AlertTriangle, CheckCircle, MapPin } from 'lucide-react';

const PREDEFINED_MESSAGES = [
  'Your vehicle is parked in a no-parking zone',
  'Your vehicle is blocking the entrance/exit',
  'Your vehicle is blocking my driveway',
  'Your vehicle is parked in a reserved spot',
  'Your vehicle is double-parked'
];

export default function ParkingAlert() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [includeLocation, setIncludeLocation] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIncludeLocation(true);
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Failed to get your location. Please try again.');
        setLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const message = customMessage.trim() || selectedMessage;

    if (!message) {
      alert('Please select or enter a message');
      return;
    }

    setLoading(true);

    try {
      const alertData = {
        vehicle_id: vehicleId,
        message: message,
        alert_type: selectedMessage ? 'wrong_parking' : 'custom',
        location_lat: includeLocation && location ? location.lat : null,
        location_lng: includeLocation && location ? location.lng : null
      };

      const { error } = await supabase
        .from('parking_alerts')
        .insert(alertData);

      if (error) throw error;

      setSuccess(true);
    } catch (error: any) {
      console.error('Error sending alert:', error);
      alert('Failed to send alert: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Alert Sent Successfully</h2>
          <p className="text-slate-600 mb-6">
            The vehicle owner has been notified anonymously. Thank you for your cooperation.
          </p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Parking Alert</h1>
              <p className="text-sm text-slate-600">Notify the vehicle owner about parking issue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Select a reason or write your own
              </label>
              <div className="space-y-2 mb-4">
                {PREDEFINED_MESSAGES.map((message, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedMessage(message);
                      setCustomMessage('');
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      selectedMessage === message
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {message}
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-slate-500">Or write a custom message</span>
                </div>
              </div>

              <textarea
                value={customMessage}
                onChange={(e) => {
                  setCustomMessage(e.target.value);
                  setSelectedMessage('');
                }}
                placeholder="Type your message here..."
                rows={4}
                className="w-full mt-4 px-4 py-3 border-b border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="includeLocation"
                  checked={includeLocation}
                  onChange={(e) => setIncludeLocation(e.target.checked)}
                  className="mt-1 w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                />
                <div className="flex-1">
                  <label htmlFor="includeLocation" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Include my location
                  </label>
                  <p className="text-xs text-slate-600 mt-1">
                    Help the owner locate their vehicle by sharing your current position
                  </p>
                  {includeLocation && !location && (
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={loading}
                      className="mt-2 flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 font-medium"
                    >
                      <MapPin className="w-4 h-4" />
                      {loading ? 'Getting location...' : 'Get Location'}
                    </button>
                  )}
                  {location && (
                    <p className="text-xs text-green-700 mt-2 font-medium">
                      Location captured
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Privacy:</strong> Your identity and contact information will remain anonymous. The owner will only receive your message.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || (!selectedMessage && !customMessage.trim())}
              className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Alert...' : 'Send Alert'}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-slate-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
