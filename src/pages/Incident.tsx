import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FileText, Upload, X, CheckCircle, MapPin } from 'lucide-react';

const INCIDENT_TYPES = [
  { value: 'damage', label: 'Vehicle Damage', description: 'Scratches, dents, broken parts' },
  { value: 'accident', label: 'Traffic Accident', description: 'Collision or road incident' },
  { value: 'other', label: 'Other', description: 'Any other incident' }
];

export default function Incident() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [incidentType, setIncidentType] = useState('damage');
  const [description, setDescription] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [includeLocation, setIncludeLocation] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

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

    if (!description.trim()) {
      alert('Please provide a description of the incident');
      return;
    }

    setLoading(true);

    try {
      let photoUrl = null;

      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${vehicleId}-${Date.now()}.${fileExt}`;
        const filePath = `incidents/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('vehicle-incidents')
          .upload(filePath, photo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('vehicle-incidents')
          .getPublicUrl(filePath);

        photoUrl = urlData.publicUrl;
      }

      const incidentData = {
        vehicle_id: vehicleId,
        description: description.trim(),
        incident_type: incidentType,
        photo_url: photoUrl,
        location_lat: includeLocation && location ? location.lat : null,
        location_lng: includeLocation && location ? location.lng : null,
        reporter_contact: reporterContact.trim() || null
      };

      const { error } = await supabase
        .from('incidents')
        .insert(incidentData);

      if (error) throw error;

      setSuccess(true);
    } catch (error: any) {
      console.error('Error submitting incident:', error);
      alert('Failed to submit incident report: ' + error.message);
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
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Report Submitted</h2>
          <p className="text-slate-600 mb-6">
            Your incident report has been sent to the vehicle owner. Thank you for your help.
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
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Report Incident</h1>
              <p className="text-sm text-slate-600">Document damage or incident involving this vehicle</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Incident Type
              </label>
              <div className="space-y-2">
                {INCIDENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setIncidentType(type.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      incidentType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className={`font-medium ${incidentType === type.value ? 'text-blue-900' : 'text-slate-800'}`}>
                      {type.label}
                    </p>
                    <p className={`text-sm ${incidentType === type.value ? 'text-blue-700' : 'text-slate-600'}`}>
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened in detail..."
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Photo <span className="text-slate-400">(Optional, Max 5MB)</span>
              </label>

              {!photoPreview ? (
                <label className="block w-full border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-slate-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 font-medium">Click to upload photo</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Contact <span className="text-slate-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="Email or phone number (if you want the owner to reach you)"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
              <p className="text-xs text-slate-600 mt-2">
                Providing your contact is optional. The report will still be anonymous unless you choose to share this.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="includeLocation"
                  checked={includeLocation}
                  onChange={(e) => setIncludeLocation(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor="includeLocation" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Include incident location
                  </label>
                  <p className="text-xs text-slate-600 mt-1">
                    Share where the incident occurred
                  </p>
                  {includeLocation && !location && (
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={loading}
                      className="mt-2 flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 font-medium"
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
                <strong>Note:</strong> This report will help the vehicle owner understand what happened. All information is treated confidentially.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting Report...' : 'Submit Report'}
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
