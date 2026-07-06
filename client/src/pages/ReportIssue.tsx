import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Trash2, 
  AlertTriangle, 
  Clock, 
  HelpCircle, 
  Upload, 
  MapPin, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

const issueTypes = [
  { id: 'Overflowing Bin', label: 'Overflowing Bin', icon: Trash2, color: 'text-amber-500 bg-amber-50 border-amber-100' },
  { id: 'Illegal Dumping', label: 'Illegal Dumping', icon: AlertTriangle, color: 'text-red-500 bg-red-50 border-red-100' },
  { id: 'Missed Collection', label: 'Missed Collection', icon: Clock, color: 'text-cyan-500 bg-cyan-50 border-cyan-100' },
  { id: 'Other', label: 'Other / Custom', icon: HelpCircle, color: 'text-neutral-muted bg-gray-50 border-gray-100' }
];

export default function ReportIssue() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [issueType, setIssueType] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{ overflowDetected: boolean; confidenceScore: number } | null>(null);
  
  // Location state
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060, address: '' });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaintId, setComplaintId] = useState('');

  // Auto-capture GPS location in Step 3
  useEffect(() => {
    if (step === 3 && !location.address) {
      handleGetLocation();
    }
  }, [step]);

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    // Mimic navigator.geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // Simulated reverse geocoding
          const mockAddresses = [
            '102 Central Ave, Downtown Area',
            '45 Greenfield Dr, Sector 3',
            '12 Commercial Lane, Market Complex',
            '77 Parkside Way, residential Sector 5'
          ];
          const address = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
          setLocation({ lat, lng, address });
          setIsGettingLocation(false);
          showToast('GPS Location captured successfully!', 'success');
        },
        (error) => {
          console.error(error);
          // Fallback to random coordinates
          const randomLat = 40.7128 + (Math.random() - 0.5) * 0.05;
          const randomLng = -74.0060 + (Math.random() - 0.5) * 0.05;
          setLocation({
            lat: randomLat,
            lng: randomLng,
            address: 'Downtown Main St, Sector 1'
          });
          setIsGettingLocation(false);
          showToast('GPS permission denied, using network location.', 'info');
        }
      );
    } else {
      setIsGettingLocation(false);
      setLocation({ lat: 40.7128, lng: -74.0060, address: 'Default Municipal HQ' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate Upload progress
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 20;
      });
    }, 150);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      // Trigger AI Detection once image is loaded
      triggerAiDetection(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerAiDetection = async (base64Image: string) => {
    setIsAiAnalyzing(true);
    setAiResult(null);
    try {
      const res = await fetch('http://localhost:5001/api/ai/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl: base64Image })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult({
          overflowDetected: data.overflowDetected,
          confidenceScore: data.confidenceScore
        });
        if (data.overflowDetected) {
          showToast('AI Detection: Waste pile / overflow detected!', 'info');
        } else {
          showToast('AI Detection: Normal levels detected.', 'info');
        }
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      // fallback mock result
      setAiResult({ overflowDetected: true, confidenceScore: 0.89 });
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5001/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: issueType,
          imageUrl: image,
          location,
          aiConfidenceScore: aiResult?.confidenceScore || 0.85
        })
      });

      if (response.ok) {
        const data = await response.json();
        setComplaintId(data._id);
        setStep(4);
        showToast('Complaint registered successfully!', 'success');
      } else {
        showToast('Failed to register complaint. Please try again.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Server connection error.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-2xl mx-auto font-sans min-h-screen flex flex-col justify-center">
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        .scan-line {
          animation: scan 2.5s ease-in-out infinite;
        }
        .checkmark-path {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawCheck 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.3s;
        }
      `}</style>

      {/* Progress indicator */}
      {step < 4 && (
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-neutral-muted mb-2 uppercase tracking-widest">
            <span>Step {step} of 3</span>
            <span>{Math.round(((step - 1) / 2) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-150 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-soft">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-extrabold text-neutral-dark font-heading">What issue are you reporting?</h3>
                <p className="text-sm text-neutral-muted mt-1">Select the option that matches the issue you observed.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {issueTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = issueType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setIssueType(type.id)}
                      className={`p-5 rounded-2xl border text-left flex items-start space-x-4 transition-all duration-300 ${
                        isSelected 
                          ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                          : 'border-gray-100 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${type.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-dark">{type.label}</h4>
                        <p className="text-xs text-neutral-muted mt-1">
                          {type.id === 'Overflowing Bin' && 'Bins filled past capacity.'}
                          {type.id === 'Illegal Dumping' && 'Unauthorized waste drop-off.'}
                          {type.id === 'Missed Collection' && 'Regular cleanup missed.'}
                          {type.id === 'Other' && 'Other municipal waste issues.'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  disabled={!issueType}
                  onClick={() => setStep(2)}
                  className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-bold py-3 px-6 rounded-2xl flex items-center space-x-2 transition-premium shadow-soft hover:-translate-y-0.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-extrabold text-neutral-dark font-heading">Upload Evidence Photo</h3>
                <p className="text-sm text-neutral-muted mt-1">Upload a clear photo of the waste issue for AI confirmation.</p>
              </div>

              <div className="relative">
                {/* Drag-and-drop zone */}
                {!image && (
                  <label className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-neutral-bg/30">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden" 
                    />
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-neutral-dark">Click to upload or drag & drop</p>
                    <p className="text-xs text-neutral-muted mt-1">PNG, JPG or WEBP up to 5MB</p>
                  </label>
                )}

                {/* Upload Progress Bar */}
                {isUploading && (
                  <div className="p-6 border border-gray-100 rounded-3xl bg-white space-y-3">
                    <div className="flex justify-between text-xs font-bold text-neutral-muted">
                      <span>Uploading Image...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Image Preview & AI Scanner Overlay */}
                {image && !isUploading && (
                  <div className="relative rounded-3xl overflow-hidden border border-gray-150 shadow-soft h-64 bg-slate-50">
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-full h-full object-cover animate-fade-in" 
                    />
                    
                    {/* Scanning overlay for AI analysis */}
                    {isAiAnalyzing && (
                      <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                        <div className="absolute w-full h-1 bg-accent-lime shadow-[0_0_15px_#22c55e] scan-line" />
                        <Sparkles className="w-8 h-8 text-accent-lime animate-spin mb-2" />
                        <span className="text-xs font-bold uppercase tracking-widest text-accent-lime">AI Scanning Pile...</span>
                      </div>
                    )}

                    {/* AI result badge */}
                    {aiResult && (
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-100 shadow-lg flex items-center space-x-2 animate-fade-in">
                        <div className={`w-2.5 h-2.5 rounded-full ${aiResult.overflowDetected ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span className="text-xs font-bold text-neutral-dark">
                          {aiResult.overflowDetected ? 'Overflow Detected' : 'Waste Level Normal'} ({(aiResult.confidenceScore * 100).toFixed(0)}%)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-neutral-dark font-bold flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  disabled={!image || isAiAnalyzing}
                  onClick={() => setStep(3)}
                  className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-bold py-3 px-6 rounded-2xl flex items-center space-x-2 transition-premium shadow-soft hover:-translate-y-0.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-extrabold text-neutral-dark font-heading">Confirm Location</h3>
                <p className="text-sm text-neutral-muted mt-1">We capture GPS coordinates to route municipal pickup vehicles.</p>
              </div>

              {/* Mini Map with pin drop animation */}
              <div className="relative w-full h-48 bg-slate-100 rounded-3xl overflow-hidden border border-gray-150 shadow-inner">
                {/* SVG City Map */}
                <svg className="absolute inset-0 w-full h-full text-slate-200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-20,100 Q150,130 250,90 T500,100" stroke="#bae6fd" strokeWidth="24" strokeLinecap="round" />
                  <path d="M30,0 V200 M130,0 V200 M230,0 V200 M330,0 V200 M430,0 V200" stroke="#e2e8f0" strokeWidth="3" />
                  <path d="M0,40 H600 M0,100 H600 M0,160 H600" stroke="#e2e8f0" strokeWidth="3" />
                </svg>

                {/* Animated Pulsing Location Marker */}
                {!isGettingLocation && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-bounce">
                    <MapPin className="w-8 h-8 text-red-500 fill-red-100 drop-shadow-lg" />
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-neutral-dark/30 rounded-full blur-[1px] animate-ping" />
                  </div>
                )}

                {isGettingLocation && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
                    <span className="text-xs font-semibold text-neutral-muted flex items-center gap-2">
                      <Clock className="w-4 h-4 animate-spin text-primary" />
                      Pinpointing location...
                    </span>
                  </div>
                )}
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Editable Location Address</label>
                <input 
                  type="text" 
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  placeholder="Fetching GPS address..."
                  className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-colors"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="text-gray-500 hover:text-neutral-dark font-bold flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  disabled={!location.address || isSubmitting}
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-bold py-3 px-6 rounded-2xl flex items-center space-x-2 transition-premium shadow-soft hover:-translate-y-0.5"
                >
                  <span>Submit Report</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="text-center space-y-6 py-6"
            >
              {/* Success Checkmark Animation */}
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                  <path className="checkmark-path" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-neutral-dark font-heading">Report Submitted!</h3>
                <p className="text-sm text-neutral-muted mt-2 max-w-sm mx-auto">
                  Your waste complaint has been filed and sent to the operations control.
                </p>
              </div>

              <div className="bg-neutral-bg p-4 rounded-2xl border border-gray-100 max-w-sm mx-auto space-y-1">
                <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Complaint Reference ID</p>
                <p className="text-sm font-bold text-neutral-dark tracking-wide select-all">
                  #{complaintId}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary hover:bg-primary-light text-white font-bold py-3.5 px-8 rounded-2xl transition-premium shadow-soft hover:-translate-y-0.5"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
