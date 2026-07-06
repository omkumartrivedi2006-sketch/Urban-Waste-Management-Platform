import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SkeletonList } from '../components/Skeletons';
import { 
  Award, 
  Plus, 
  MapPin, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Truck, 
  TrendingUp, 
  ChevronRight,
  ChevronLeft,
  Navigation,
  Map,
  Gift,
  AlertCircle,
  Download,
  Edit,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Animated Counter Component for Points
const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end <= 0) {
      setCount(0);
      return;
    }
    const duration = 1000; // ms
    const increment = Math.ceil(end / (duration / 30));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
};

// Interactive Animated SVG Map for nearby complaints
const MockMap: React.FC<{ pins: any[] }> = ({ pins }) => {
  return (
    <div className="relative w-full h-64 bg-slate-100 rounded-3xl overflow-hidden border border-gray-150 shadow-inner">
      {/* City Map SVG Background */}
      <svg className="absolute inset-0 w-full h-full text-slate-200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* River/Water body */}
        <path d="M-20,180 Q150,150 250,220 T500,190" stroke="#bae6fd" strokeWidth="32" strokeLinecap="round" />
        {/* Road Network Grid */}
        <path d="M50,0 V300 M150,0 V300 M250,0 V300 M350,0 V300 M450,0 V300" stroke="#e2e8f0" strokeWidth="4" />
        <path d="M0,60 H600 M0,140 H600 M0,220 H600" stroke="#e2e8f0" strokeWidth="4" />
        {/* Main Highway */}
        <path d="M-10,100 L610,240" stroke="#cbd5e1" strokeWidth="12" />
        <path d="M-10,100 L610,240" stroke="#fef08a" strokeWidth="2" strokeDasharray="6,6" />
        {/* Green Parks */}
        <rect x="20" y="10" width="80" height="40" rx="8" fill="#dcfce7" />
        <rect x="280" y="80" width="50" height="50" rx="8" fill="#dcfce7" />
        <rect x="380" y="10" width="60" height="40" rx="8" fill="#dcfce7" />
      </svg>

      {/* Title / Legend */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm z-10 flex items-center space-x-1.5">
        <Map className="w-3.5 h-3.5 text-primary animate-pulse" />
        <span className="text-[10px] font-bold text-neutral-dark">Live Map (Nearby Bins & Issues)</span>
      </div>

      {/* Pins */}
      {pins.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
          <span className="text-xs font-semibold text-neutral-muted">No waste piles detected nearby.</span>
        </div>
      ) : (
        pins.map((pin, index) => {
          const hash = pin._id ? pin._id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) : index;
          const x = pin.location?.lng ? Math.abs((pin.location.lng * 2345) % 80) + 10 : (hash * 7) % 80 + 10;
          const y = pin.location?.lat ? Math.abs((pin.location.lat * 1234) % 80) + 10 : (hash * 13) % 80 + 10;

          const colorClass = pin.status === 'Resolved' 
            ? 'bg-emerald-500' 
            : pin.status === 'In Progress' || pin.status === 'Assigned'
            ? 'bg-cyan-500' 
            : 'bg-amber-500';

          return (
            <div 
              key={pin._id || index} 
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {/* Pulsing ring */}
              <span className={`absolute -inset-2 rounded-full opacity-40 animate-ping ${colorClass}`} />
              {/* The pin point */}
              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md relative z-10 ${colorClass}`} />
              {/* Tooltip on Hover */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-dark text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 flex flex-col items-center">
                <span>{pin.type}</span>
                <span className="text-[8px] font-medium opacity-80">{pin.location?.address || 'Waste Pile'} ({pin.status})</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

/* ==========================================
   1. CITIZEN DASHBOARD
   ========================================== */
export const CitizenDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [allReports, setAllReports] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch user's own reports
      const response = await fetch('http://localhost:5001/api/complaints', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }

      // Fetch all reports to display on nearby map
      const allResponse = await fetch('http://localhost:5001/api/complaints/all');
      if (allResponse.ok) {
        const allData = await allResponse.json();
        setAllReports(allData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast('Could not sync with server. Using cached data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const triggerRefresh = () => {
    fetchDashboardData();
    showToast('Dashboard data refreshed!', 'success');
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-soft gap-4 transition-all duration-300 hover:shadow-premium">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-dark font-heading flex items-center gap-2">
            <span>Hello, {user?.name}!</span>
            <span className="inline-block animate-bounce">👋</span>
          </h2>
          <p className="text-sm text-neutral-muted mt-1">
            Track your waste reports and view your recycling points reward ledger.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={triggerRefresh}
            className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl transition-colors border border-gray-100 flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/report')}
            className="bg-primary hover:bg-primary-light text-white font-semibold py-3 px-5 rounded-2xl flex items-center space-x-2 transition-premium shadow-soft hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Report Waste Pile</span>
          </button>
        </div>
      </div>

      {/* Quick Actions & Interactive Map Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Action Cards */}
        <div className="lg:col-span-1 grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/report')}
            className="flex flex-col justify-between items-start p-5 bg-white border border-gray-100 rounded-3xl text-left transition-premium hover:-translate-y-1 hover:shadow-premium group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <Plus className="w-5 h-5" />
            </div>
            <div className="mt-8">
              <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Report New</p>
              <h4 className="text-sm font-bold text-neutral-dark mt-1 font-heading">Issue</h4>
            </div>
          </button>

          <button 
            onClick={() => navigate('/my-complaints')}
            className="flex flex-col justify-between items-start p-5 bg-white border border-gray-100 rounded-3xl text-left transition-premium hover:-translate-y-1 hover:shadow-premium group"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="mt-8">
              <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">My File</p>
              <h4 className="text-sm font-bold text-neutral-dark mt-1 font-heading">Complaints</h4>
            </div>
          </button>

          <button 
            onClick={() => showToast('Smart IoT Bins & Trucks located near Sector 5/Downtown are active.', 'info')}
            className="flex flex-col justify-between items-start p-5 bg-white border border-gray-100 rounded-3xl text-left transition-premium hover:-translate-y-1 hover:shadow-premium group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <Truck className="w-5 h-5" />
            </div>
            <div className="mt-8">
              <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Nearby Bins</p>
              <h4 className="text-sm font-bold text-neutral-dark mt-1 font-heading">& Trucks</h4>
            </div>
          </button>

          <button 
            onClick={() => showToast('Earn points by submitting valid waste overflow reports. Points can be redeemed for local store gift vouchers.', 'info')}
            className="flex flex-col justify-between items-start p-5 bg-white border border-gray-100 rounded-3xl text-left transition-premium hover:-translate-y-1 hover:shadow-premium group"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <Gift className="w-5 h-5" />
            </div>
            <div className="mt-8">
              <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Redeem</p>
              <h4 className="text-sm font-bold text-neutral-dark mt-1 font-heading">Rewards</h4>
            </div>
          </button>
        </div>

        {/* Embedded Map */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-4 rounded-3xl shadow-soft">
          <MockMap pins={allReports} />
        </div>
      </div>

      {/* Citizen Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Recycle Points</p>
            <h3 className="text-2xl font-extrabold text-neutral-dark mt-1 font-heading">
              <AnimatedCounter value={user?.points || 0} /> pts
            </h3>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Reports Filed</p>
            <h3 className="text-2xl font-extrabold text-neutral-dark mt-1 font-heading">
              {isLoading ? '...' : reports.length}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Resolved Reports</p>
            <h3 className="text-2xl font-extrabold text-neutral-dark mt-1 font-heading">
              {isLoading ? '...' : reports.filter(r => r.status === 'Resolved').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-neutral-dark font-heading">Recent Complaints</h3>
          <button 
            onClick={() => navigate('/my-complaints')}
            className="text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-3.5 py-2 rounded-xl border border-primary/10 transition-colors flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <SkeletonList count={3} />
        ) : reports.length === 0 ? (
          <div className="p-8 text-center bg-white border border-gray-100 rounded-3xl shadow-soft">
            <AlertCircle className="w-8 h-8 text-neutral-muted mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-muted">You haven't reported any issues yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.slice(0, 3).map((report) => (
              <div 
                key={report._id} 
                className="p-6 bg-white border border-gray-100 rounded-3xl shadow-soft flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2 text-xs font-bold text-neutral-muted">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  {/* Status Badge with color transition styling */}
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all duration-500 ease-in-out ${
                    report.status === 'Resolved' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : report.status === 'In Progress' || report.status === 'Assigned'
                      ? 'bg-cyan-50 text-cyan-700 border-cyan-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {report.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-neutral-dark truncate">{report.type}</h4>
                  <p className="text-xs text-neutral-muted mt-1 leading-normal truncate">{report.location?.address}</p>
                </div>

                {report.imageUrl && (
                  <div className="w-full h-32 rounded-2xl overflow-hidden border border-gray-50">
                    <img 
                      src={report.imageUrl} 
                      alt="waste-pile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-400">AI Confidence</span>
                  <span className="text-xs font-bold text-primary">
                    {report.aiConfidenceScore ? `${(report.aiConfidenceScore * 100).toFixed(0)}%` : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

/* ==========================================
   2. DRIVER DASHBOARD
   ========================================== */
export const DriverDashboard: React.FC = () => {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [onDuty, setOnDuty] = useState(true);
  const [activeRoute, setActiveRoute] = useState<any>(null);
  const [isMapActive, setIsMapActive] = useState(false);
  
  // Driving Simulation State
  const [driverLoc, setDriverLoc] = useState({ lat: 40.7128, lng: -74.0060 });
  const [currentStopIdx, setCurrentStopIdx] = useState(0);
  const [stopStates, setStopStates] = useState<string[]>([]); // 'Pending', 'Arrived', 'Collected'

  const fetchRoute = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/routes/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setActiveRoute(data);
        
        // Initialize stop states
        const states = data.optimizedOrder.map((stop: any) => {
          if (stop.status === 'Resolved') return 'Collected';
          return 'Pending';
        });
        setStopStates(states);

        // Set active index to first pending stop
        const firstPendingIdx = states.findIndex((s: string) => s !== 'Collected');
        setCurrentStopIdx(firstPendingIdx === -1 ? states.length : firstPendingIdx);
      }
    } catch (error) {
      console.error(error);
      showToast('Error syncing route telemetry.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'Driver') {
      fetchRoute();
    }
  }, [token, user]);

  // Update Driver Polling Location on backend when it shifts
  useEffect(() => {
    const updateLocationOnBackend = async () => {
      if (!token) return;
      try {
        await fetch('http://localhost:5001/api/vehicles/me/location', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(driverLoc)
        });
      } catch (error) {
        console.error('Location sync error:', error);
      }
    };
    updateLocationOnBackend();
  }, [driverLoc, token]);

  const handleDutyToggle = async () => {
    const nextState = !onDuty;
    setOnDuty(nextState);
    try {
      await fetch('http://localhost:5001/api/vehicles/me/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextState ? 'Active' : 'Inactive' })
      });
      showToast(`Status set to: ${nextState ? 'ON DUTY' : 'OFF DUTY'}`, 'success');
    } catch (error) {
      console.error(error);
    }
  };

  // Calculate stats
  const stopsCount = activeRoute?.optimizedOrder?.length || 0;
  const completedStops = stopStates.filter(s => s === 'Collected').length;
  
  // Simple distance estimator
  const calculateTotalDistance = () => {
    if (!activeRoute?.optimizedOrder) return '0 km';
    let dist = 0;
    let prev = { lat: 40.7128, lng: -74.0060 };
    activeRoute.optimizedOrder.forEach((stop: any) => {
      const slat = stop.location?.lat || 40.7128;
      const slng = stop.location?.lng || -74.0060;
      // Simple coordinate distance approximation for visual summary
      dist += Math.sqrt(Math.pow(slat - prev.lat, 2) + Math.pow(slng - prev.lng, 2)) * 111;
      prev = { lat: slat, lng: slng };
    });
    return `${dist.toFixed(1)} km`;
  };

  const calculateTotalTime = () => {
    if (!activeRoute?.optimizedOrder) return '0 mins';
    const stops = activeRoute.optimizedOrder.length;
    // 5 mins per stop + 2 mins per km estimated
    const mins = stops * 8 + 12;
    return `${mins} mins`;
  };

  // Mark current stop as Arrived
  const handleMarkArrived = () => {
    const nextStates = [...stopStates];
    nextStates[currentStopIdx] = 'Arrived';
    setStopStates(nextStates);
    
    // Animate driver moving to the coordinates of this stop
    const targetStop = activeRoute.optimizedOrder[currentStopIdx];
    if (targetStop && targetStop.location) {
      setDriverLoc({
        lat: targetStop.location.lat,
        lng: targetStop.location.lng
      });
    }
    showToast('Arrived at collection point!', 'success');
  };

  // Mark current stop as Collected
  const handleMarkCollected = async () => {
    const targetStop = activeRoute.optimizedOrder[currentStopIdx];
    if (!targetStop) return;

    try {
      const response = await fetch('http://localhost:5001/api/routes/me/clear-stop', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ complaintId: targetStop._id })
      });

      if (response.ok) {
        const nextStates = [...stopStates];
        nextStates[currentStopIdx] = 'Collected';
        setStopStates(nextStates);

        // Advance to next stop
        const nextIdx = currentStopIdx + 1;
        setCurrentStopIdx(nextIdx);

        showToast('Waste collected! Citizen notified.', 'success');
      }
    } catch (error) {
      console.error(error);
      showToast('Connection error.', 'error');
    }
  };

  if (isMapActive && activeRoute) {
    return (
      <div className="pt-20 min-h-screen bg-neutral-bg font-sans flex flex-col">
        {/* Fullscreen Map Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMapActive(false)}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="text-sm font-extrabold text-neutral-dark font-heading">Optimized Pickup Route</h3>
              <p className="text-xs text-neutral-muted">Progress: {completedStops} / {stopsCount} Collected</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full sm:w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-lime transition-all duration-500"
              style={{ width: `${(completedStops / stopsCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Map and Active Stop Section */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3">
          
          {/* Left panel: Active Stop Details / Queue */}
          <div className="lg:col-span-1 border-r border-gray-100 bg-white p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Pickup Schedule</h4>
              
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {activeRoute.optimizedOrder.map((stop: any, idx: number) => {
                  const state = stopStates[idx];
                  const isActive = idx === currentStopIdx;

                  return (
                    <div 
                      key={stop._id} 
                      className={`p-4 rounded-2xl border transition-all duration-300 ${
                        isActive 
                          ? 'border-primary ring-2 ring-primary/10 bg-primary/5' 
                          : 'border-gray-100'
                      } ${state === 'Collected' ? 'opacity-60' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            state === 'Collected' 
                              ? 'bg-emerald-500 text-white' 
                              : isActive 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-neutral-dark">{stop.type}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          state === 'Collected' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : state === 'Arrived'
                            ? 'bg-cyan-50 text-cyan-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {state}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-muted mt-2 font-medium">{stop.location?.address}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stop Action Bar */}
            {currentStopIdx < stopsCount ? (
              <div className="pt-4 border-t border-gray-50 space-y-3">
                <div className="bg-neutral-bg p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Current Target Stop #{currentStopIdx + 1}</p>
                  <h5 className="font-extrabold text-sm text-neutral-dark mt-1">
                    {activeRoute.optimizedOrder[currentStopIdx]?.type}
                  </h5>
                  <p className="text-xs text-neutral-muted mt-1">
                    {activeRoute.optimizedOrder[currentStopIdx]?.location?.address}
                  </p>
                </div>

                {stopStates[currentStopIdx] === 'Pending' ? (
                  <button
                    onClick={handleMarkArrived}
                    className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3.5 rounded-2xl transition-premium shadow-soft flex items-center justify-center space-x-2"
                  >
                    <MapPin className="w-4 h-4 text-accent-lime" />
                    <span>Confirm Arrival</span>
                  </button>
                ) : (
                  <button
                    onClick={handleMarkCollected}
                    className="w-full bg-accent-lime hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl transition-premium shadow-soft flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Mark Collected</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-sm text-emerald-800">All Pickups Cleared!</h4>
                <p className="text-xs text-emerald-700 leading-normal">Today's assigned trajectory is complete.</p>
                <button
                  onClick={() => setIsMapActive(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors w-full mt-2"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>

          {/* Right panel: Fullscreen Route Map SVG */}
          <div className="lg:col-span-2 relative bg-slate-50 overflow-hidden h-[400px] lg:h-auto border-t lg:border-t-0 border-gray-100">
            {/* The Route Map Grid */}
            <svg className="absolute inset-0 w-full h-full text-slate-200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-20,250 Q150,220 250,300 T500,280" stroke="#bae6fd" strokeWidth="48" strokeLinecap="round" />
              <path d="M50,0 V600 M150,0 V600 M250,0 V600 M350,0 V600 M450,0 V600 M550,0 V600" stroke="#e2e8f0" strokeWidth="4" />
              <path d="M0,80 H800 M0,200 H800 M0,320 H800 M0,440 H800" stroke="#e2e8f0" strokeWidth="4" />
            </svg>

            {/* Render optimized route trajectory connector */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {activeRoute.optimizedOrder.map((stop: any, idx: number) => {
                if (idx === 0) return null;
                const prevStop = activeRoute.optimizedOrder[idx - 1];
                const hash1 = prevStop._id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                const hash2 = stop._id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                const x1 = prevStop.location?.lng ? Math.abs((prevStop.location.lng * 2345) % 80) + 10 : (hash1 * 7) % 80 + 10;
                const y1 = prevStop.location?.lat ? Math.abs((prevStop.location.lat * 1234) % 80) + 10 : (hash1 * 13) % 80 + 10;
                const x2 = stop.location?.lng ? Math.abs((stop.location.lng * 2345) % 80) + 10 : (hash2 * 7) % 80 + 10;
                const y2 = stop.location?.lat ? Math.abs((stop.location.lat * 1234) % 80) + 10 : (hash2 * 13) % 80 + 10;

                return (
                  <line 
                    key={idx}
                    x1={`${x1}%`} 
                    y1={`${y1}%`} 
                    x2={`${x2}%`} 
                    y2={`${y2}%`} 
                    stroke="#0F5132" 
                    strokeWidth="3.5" 
                    strokeDasharray="8,8" 
                    className="opacity-75"
                  />
                );
              })}
            </svg>

            {/* Pins */}
            {activeRoute.optimizedOrder.map((stop: any, idx: number) => {
              const hash = stop._id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
              const x = stop.location?.lng ? Math.abs((stop.location.lng * 2345) % 80) + 10 : (hash * 7) % 80 + 10;
              const y = stop.location?.lat ? Math.abs((stop.location.lat * 1234) % 80) + 10 : (hash * 13) % 80 + 10;

              const state = stopStates[idx];
              const isResolved = state === 'Collected';
              const isActive = idx === currentStopIdx;

              const pinColor = isResolved 
                ? 'bg-emerald-500' 
                : isActive 
                ? 'bg-primary' 
                : 'bg-amber-500';

              return (
                <div 
                  key={stop._id} 
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span className={`absolute -inset-2 rounded-full opacity-40 animate-ping ${isActive ? 'bg-primary' : 'bg-transparent'}`} />
                  <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white ${pinColor}`}>
                    {idx + 1}
                  </div>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-neutral-dark text-white text-[9px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {stop.type} ({stop.status})
                  </div>
                </div>
              );
            })}

            {/* Pulsing Driver Location pin */}
            <div 
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-[1500ms] ease-in-out"
              style={{ 
                left: `${driverLoc.lng ? Math.abs((driverLoc.lng * 2345) % 80) + 10 : 50}%`, 
                top: `${driverLoc.lat ? Math.abs((driverLoc.lat * 1234) % 80) + 10 : 50}%` 
              }}
            >
              <span className="absolute -inset-3 rounded-full opacity-35 bg-accent-lime animate-ping" />
              <div className="w-8 h-8 rounded-2xl bg-accent-lime text-white flex items-center justify-center shadow-premium border-2 border-white">
                <Truck className="w-4 h-4 text-white" />
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-soft gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-dark font-heading">
            Driver Console: {user?.name}
          </h2>
          <p className="text-sm text-neutral-muted mt-1">
            Access assigned municipal routes, coordinates, and report bin clearance.
          </p>
        </div>

        {/* Animated On Duty Switch */}
        <div className="flex items-center space-x-3 bg-neutral-bg p-3.5 rounded-2xl border border-gray-100">
          <span className={`text-xs font-bold transition-all duration-300 ${onDuty ? 'text-accent-lime font-black' : 'text-neutral-muted'}`}>
            {onDuty ? 'ON DUTY' : 'OFF DUTY'}
          </span>
          <button 
            onClick={handleDutyToggle} 
            className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-300 flex items-center ${onDuty ? 'bg-accent-lime' : 'bg-gray-300'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${onDuty ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Driver Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <button 
          onClick={() => navigate('/driver/vehicle')}
          className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft flex items-center space-x-4 text-left transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Truck Telematics</p>
            <h3 className="text-md font-extrabold text-neutral-dark mt-1 font-heading flex items-center gap-1.5">
              <span>Eco-Cab #08</span>
              <ChevronRight className="w-4 h-4 text-cyan-600" />
            </h3>
          </div>
        </button>

        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Assigned Pickups</p>
            <h3 className="text-2xl font-extrabold text-neutral-dark mt-1 font-heading">
              {isLoading ? '...' : stopsCount - completedStops}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider">Stops Completed</p>
            <h3 className="text-2xl font-extrabold text-neutral-dark mt-1 font-heading">
              {isLoading ? '...' : completedStops}
            </h3>
          </div>
        </div>
      </div>

      {/* Assigned Route Summary Card */}
      {activeRoute && (
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-bold text-primary bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">Assigned Task</span>
              <h3 className="text-lg font-extrabold text-neutral-dark font-heading mt-2">Today's Optimized Trajectory</h3>
            </div>
            <button
              disabled={!onDuty}
              onClick={() => setIsMapActive(true)}
              className="bg-gradient-eco hover:shadow-premium text-white font-bold py-3 px-6 rounded-2xl flex items-center space-x-2 transition-premium hover:-translate-y-0.5 disabled:opacity-40"
            >
              <Navigation className="w-4 h-4 text-accent-lime animate-pulse" />
              <span>Launch Live Navigator</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="bg-neutral-bg p-4 rounded-2xl border border-gray-100 text-center">
              <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Total Waypoints</p>
              <p className="text-xl font-extrabold text-neutral-dark mt-1 font-heading">{stopsCount} Stops</p>
            </div>
            <div className="bg-neutral-bg p-4 rounded-2xl border border-gray-100 text-center">
              <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Approx. Distance</p>
              <p className="text-xl font-extrabold text-neutral-dark mt-1 font-heading">{calculateTotalDistance()}</p>
            </div>
            <div className="bg-neutral-bg p-4 rounded-2xl border border-gray-100 text-center">
              <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Est. Travel Time</p>
              <p className="text-xl font-extrabold text-neutral-dark mt-1 font-heading">{calculateTotalTime()}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

/* ==========================================
   3. ADMIN DASHBOARD
   ========================================== */
export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const COLORS = ['#0F5132', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  const [activeTab, setActiveTab] = useState('Overview');
  const [isLoading, setIsLoading] = useState(true);

  // Aggregated Telemetry States
  const [kpis, setKpis] = useState({ totalComplaints: 0, resolvedToday: 0, activeVehicles: 0, avgResolutionTime: 0.0 });
  const [areaGeneration, setAreaGeneration] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [resolutionTrends, setResolutionTrends] = useState<any[]>([]);
  const [vehiclePerformance, setVehiclePerformance] = useState<any[]>([]);

  // Complaints state for Map/Table
  const [complaints, setComplaints] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  // Table Sorting, Filtering & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selection & Bulk Action Modals
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'verify' | 'assign' | 'escalate'>('verify');
  const [bulkVehicleId, setBulkVehicleId] = useState('');

  // Fleet editor slide-over panel
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [formVehicleId, setFormVehicleId] = useState('');
  const [formDriverId, setFormDriverId] = useState('');
  const [formStatus, setFormStatus] = useState('Active');
  const [formFuelLevel, setFormFuelLevel] = useState(100);

  // Analytics Date Filter
  const [dateRange, setDateRange] = useState('7 Days');

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch KPIs
      const kpiRes = await fetch('http://localhost:5001/api/analytics/kpis', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (kpiRes.ok) setKpis(await kpiRes.json());

      // 2. Fetch Area generation
      const areaRes = await fetch('http://localhost:5001/api/analytics/area-generation', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (areaRes.ok) setAreaGeneration(await areaRes.json());

      // 3. Fetch Categories
      const catRes = await fetch('http://localhost:5001/api/analytics/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (catRes.ok) setCategories(await catRes.json());

      // 4. Fetch Resolution trends
      const trendRes = await fetch('http://localhost:5001/api/analytics/resolution-trends', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (trendRes.ok) setResolutionTrends(await trendRes.json());

      // 5. Fetch Vehicle Performance
      const perfRes = await fetch('http://localhost:5001/api/analytics/vehicle-performance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (perfRes.ok) setVehiclePerformance(await perfRes.json());

      // 6. Fetch Complaints
      const compRes = await fetch('http://localhost:5001/api/complaints/all');
      if (compRes.ok) setComplaints(await compRes.json());

      // 7. Fetch Vehicles
      const vehRes = await fetch('http://localhost:5001/api/admin/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (vehRes.ok) setVehicles(await vehRes.json());

      // 8. Fetch Drivers
      const drRes = await fetch('http://localhost:5001/api/admin/drivers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (drRes.ok) setDrivers(await drRes.json());

    } catch (error) {
      console.error(error);
      showToast('Error syncing administrative data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token, dateRange]);

  // Bulk actions trigger
  const handleBulkAction = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/complaints/bulk', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          complaintIds: selectedComplaints,
          action: bulkAction,
          vehicleId: bulkVehicleId
        })
      });

      if (response.ok) {
        showToast('Bulk update completed successfully!', 'success');
        setSelectedComplaints([]);
        setIsBulkModalOpen(false);
        fetchAdminData();
      } else {
        showToast('Error processing bulk operations.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Connection error.', 'error');
    }
  };

  // Add/Edit Vehicle submission
  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingVehicleId 
        ? `http://localhost:5001/api/admin/vehicles/${editingVehicleId}`
        : 'http://localhost:5001/api/admin/vehicles';
      
      const method = editingVehicleId ? 'PUT' : 'POST';
      const body: any = {
        vehicleId: formVehicleId,
        driverId: formDriverId || null,
        status: formStatus,
        fuelLevel: formFuelLevel
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        showToast(editingVehicleId ? 'Vehicle updated successfully!' : 'Vehicle created successfully!', 'success');
        setIsSlideOverOpen(false);
        setEditingVehicleId(null);
        setFormVehicleId('');
        setFormDriverId('');
        fetchAdminData();
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Error saving vehicle.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Connection error.', 'error');
    }
  };

  // Trigger editing a vehicle
  const handleEditVehicle = (veh: any) => {
    setEditingVehicleId(veh._id);
    setFormVehicleId(veh.vehicleId);
    setFormDriverId(veh.driverId?._id || '');
    setFormStatus(veh.status);
    setFormFuelLevel(veh.fuelLevel);
    setIsSlideOverOpen(true);
  };

  // Export report CSV mock download
  const handleExportReport = () => {
    if (complaints.length === 0) return;
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID,Type,Address,Latitude,Longitude,Status,AI Confidence,CreatedAt\n';
    
    complaints.forEach((c) => {
      csvContent += `"${c._id}","${c.type}","${c.location?.address}","${c.location?.lat}","${c.location?.lng}","${c.status}","${c.aiConfidenceScore}","${c.createdAt}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UWMP_Complaints_Report_${dateRange.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report CSV file downloaded.', 'success');
  };

  // Sparkline chart dummy data
  const complaintsSparkline = [{ v: 24 }, { v: 28 }, { v: 22 }, { v: 34 }, { v: 38 }, { v: 42 }, { v: kpis.totalComplaints }];
  const resolvedSparkline = [{ v: 8 }, { v: 12 }, { v: 10 }, { v: 15 }, { v: 14 }, { v: 18 }, { v: kpis.resolvedToday }];
  const vehiclesSparkline = [{ v: 4 }, { v: 5 }, { v: 5 }, { v: 6 }, { v: 6 }, { v: 6 }, { v: kpis.activeVehicles }];
  const timeSparkline = [{ v: 6.2 }, { v: 5.8 }, { v: 5.5 }, { v: 5.0 }, { v: 4.8 }, { v: 4.4 }, { v: kpis.avgResolutionTime }];

  // Table filtering and pagination logic
  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const filtered = complaints
    .filter((c) => {
      const matchSearch = c.location?.address?.toLowerCase().includes(search.toLowerCase()) || c._id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'location') {
        valA = a.location?.address;
        valB = b.location?.address;
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedComplaints = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectComplaint = (id: string) => {
    if (selectedComplaints.includes(id)) {
      setSelectedComplaints(selectedComplaints.filter((i) => i !== id));
    } else {
      setSelectedComplaints([...selectedComplaints, id]);
    }
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-soft gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-dark font-heading">
            Admin Console: Municipal Panel
          </h2>
          <p className="text-sm text-neutral-muted mt-1">
            Review live telemetry alerts, overflow statistics, and municipal operations.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-gray-50 border border-gray-100 p-1 rounded-2xl">
          {['Overview', 'Complaints', 'Analytics', 'Fleet'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-primary text-white shadow-soft' 
                  : 'text-neutral-muted hover:text-neutral-dark'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <div key={n} className="h-28 bg-white rounded-3xl animate-pulse" />)}
          </div>
          <div className="h-96 bg-white rounded-3xl animate-pulse" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* KPI Cards with recharts sparklines */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                
                {/* Card 1 */}
                <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-soft flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Total Complaints</p>
                      <h3 className="text-2xl font-extrabold text-neutral-dark mt-1 font-heading">
                        <AnimatedCounter value={kpis.totalComplaints} />
                      </h3>
                    </div>
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                  {/* Sparkline chart */}
                  <div className="h-10 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={complaintsSparkline}>
                        <Area type="monotone" dataKey="v" stroke="#F59E0B" fill="#FEF3C7" strokeWidth={1.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-soft flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Resolved Today</p>
                      <h3 className="text-2xl font-extrabold text-neutral-dark mt-1 font-heading">
                        <AnimatedCounter value={kpis.resolvedToday} />
                      </h3>
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  {/* Sparkline */}
                  <div className="h-10 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={resolvedSparkline}>
                        <Area type="monotone" dataKey="v" stroke="#10B981" fill="#D1FAE5" strokeWidth={1.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-soft flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Active Fleet</p>
                      <h3 className="text-2xl font-extrabold text-neutral-dark mt-1 font-heading">
                        <AnimatedCounter value={kpis.activeVehicles} />
                      </h3>
                    </div>
                    <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
                      <Truck className="w-5 h-5" />
                    </div>
                  </div>
                  {/* Sparkline */}
                  <div className="h-10 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={vehiclesSparkline}>
                        <Area type="monotone" dataKey="v" stroke="#06B6D4" fill="#CFFAFE" strokeWidth={1.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-soft flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Avg. SLA Time</p>
                      <h3 className="text-2xl font-extrabold text-neutral-dark mt-1 font-heading">
                        {kpis.avgResolutionTime} hrs
                      </h3>
                    </div>
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  {/* Sparkline */}
                  <div className="h-10 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timeSparkline}>
                        <Area type="monotone" dataKey="v" stroke="#6366F1" fill="#E0E7FF" strokeWidth={1.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Live City Map Panel */}
              <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-soft space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-extrabold text-neutral-dark font-heading">Live Global Fleet & Incidents Map</h3>
                  <div className="text-[10px] font-bold text-neutral-muted bg-gray-50 border px-3 py-1 rounded-full flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent-lime animate-ping" />
                    <span>Live Tracking (Auto Polling)</span>
                  </div>
                </div>

                {/* Map Grid */}
                <div className="relative w-full h-[400px] bg-slate-100 rounded-3xl overflow-hidden border border-gray-150 shadow-inner">
                  {/* City Map SVG Background */}
                  <svg className="absolute inset-0 w-full h-full text-slate-200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-20,200 Q200,160 300,280 T700,240" stroke="#bae6fd" strokeWidth="48" strokeLinecap="round" />
                    <path d="M80,0 V400 M200,0 V400 M320,0 V400 M440,0 V400 M560,0 V400 M680,0 V400 M800,0 V400 M920,0 V400" stroke="#e2e8f0" strokeWidth="4" />
                    <path d="M0,80 H1200 M0,200 H1200 M0,320 H1200" stroke="#e2e8f0" strokeWidth="4" />
                  </svg>

                  {/* Render active complaints pins */}
                  {complaints.map((pin) => {
                    const hash = pin._id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                    const x = pin.location?.lng ? Math.abs((pin.location.lng * 2345) % 80) + 10 : (hash * 7) % 80 + 10;
                    const y = pin.location?.lat ? Math.abs((pin.location.lat * 1234) % 80) + 10 : (hash * 13) % 80 + 10;

                    const colorClass = pin.status === 'Resolved' 
                      ? 'bg-emerald-500' 
                      : pin.status === 'In Progress' || pin.status === 'Assigned'
                      ? 'bg-cyan-500' 
                      : 'bg-amber-500';

                    return (
                      <div 
                        key={pin._id} 
                        className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        <span className={`absolute -inset-1.5 rounded-full opacity-35 animate-ping ${colorClass}`} />
                        <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-md relative ${colorClass}`} />
                        {/* Tooltip */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-dark text-white text-[9px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 flex flex-col items-center">
                          <span>{pin.type}</span>
                          <span className="text-[8px] font-medium opacity-80">{pin.location?.address} ({pin.status})</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Render active vehicles pins */}
                  {vehicles.map((veh) => {
                    const latVal = veh.currentLocation?.lat || 40.7128;
                    const lngVal = veh.currentLocation?.lng || -74.0060;
                    const x = Math.abs((lngVal * 2345) % 80) + 10;
                    const y = Math.abs((latVal * 1234) % 80) + 10;

                    return (
                      <div 
                        key={veh._id} 
                        className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        <span className="absolute -inset-3.5 rounded-full opacity-40 bg-accent-lime animate-ping" />
                        <div className="w-8 h-8 rounded-2xl bg-accent-lime text-white flex items-center justify-center shadow-premium border-2 border-white">
                          <Truck className="w-4 h-4 text-white" />
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-accent-lime text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 flex flex-col items-center">
                          <span>{veh.vehicleId}</span>
                          <span className="text-[8px] font-medium opacity-80">Driver: {veh.driverId?.name || 'Unassigned'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: COMPLAINTS DATA TABLE */}
          {activeTab === 'Complaints' && (
            <motion.div
              key="complaints"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-sm font-extrabold text-neutral-dark font-heading">Global Complaints Registry</h3>
                
                {/* Search & Filter row */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search address or reference..."
                    className="px-4 py-2 border border-gray-150 rounded-xl text-xs outline-none focus:border-primary w-full sm:w-48 transition-colors"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-150 rounded-xl text-xs outline-none focus:border-primary bg-white cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Bulk operations bar */}
              {selectedComplaints.length > 0 && (
                <div className="bg-primary/5 border border-primary/10 p-3.5 rounded-2xl flex items-center justify-between animate-fade-in">
                  <span className="text-xs font-bold text-primary">{selectedComplaints.length} selected complaints</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => { setBulkAction('verify'); setIsBulkModalOpen(true); }}
                      className="bg-white border text-neutral-dark text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Verify Selection
                    </button>
                    <button
                      onClick={() => { setBulkAction('assign'); setIsBulkModalOpen(true); }}
                      className="bg-primary text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-primary-light transition-colors"
                    >
                      Assign Vehicle
                    </button>
                    <button
                      onClick={() => { setBulkAction('escalate'); setIsBulkModalOpen(true); }}
                      className="bg-white border text-red-600 border-red-100 text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Escalate Dispatch
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-bg/60 border-b border-gray-100 text-[10px] font-bold text-neutral-muted uppercase tracking-wider">
                      <th className="p-4 w-12 text-center">
                        <input 
                          type="checkbox"
                          checked={selectedComplaints.length === paginatedComplaints.length && paginatedComplaints.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedComplaints(paginatedComplaints.map(c => c._id));
                            } else {
                              setSelectedComplaints([]);
                            }
                          }}
                          className="rounded"
                        />
                      </th>
                      <th className="p-4 cursor-pointer hover:text-neutral-dark" onClick={() => handleSort('_id')}>Reference ID</th>
                      <th className="p-4 cursor-pointer hover:text-neutral-dark" onClick={() => handleSort('type')}>Issue Type</th>
                      <th className="p-4 cursor-pointer hover:text-neutral-dark" onClick={() => handleSort('location')}>Location</th>
                      <th className="p-4 cursor-pointer hover:text-neutral-dark" onClick={() => handleSort('assignedVehicleId')}>Assigned Vehicle</th>
                      <th className="p-4 cursor-pointer hover:text-neutral-dark" onClick={() => handleSort('createdAt')}>Time Open</th>
                      <th className="p-4 cursor-pointer hover:text-neutral-dark" onClick={() => handleSort('status')}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {paginatedComplaints.map((c) => {
                      const isSelected = selectedComplaints.includes(c._id);
                      // Calculate difference in hours
                      const hoursOpen = Math.round((Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60));

                      return (
                        <tr key={c._id} className={`hover:bg-gray-50/40 transition-colors ${isSelected ? 'bg-primary/5 hover:bg-primary/5' : ''}`}>
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => toggleSelectComplaint(c._id)}
                              className="rounded"
                            />
                          </td>
                          <td className="p-4 font-bold text-neutral-dark">#{c._id.substring(18)}</td>
                          <td className="p-4 font-semibold text-primary-light">{c.type}</td>
                          <td className="p-4 text-neutral-muted font-medium max-w-xs truncate">{c.location?.address}</td>
                          <td className="p-4 font-bold text-neutral-dark">{c.assignedVehicleId || 'Not Assigned'}</td>
                          <td className="p-4 text-neutral-muted font-medium">{c.status === 'Resolved' ? 'Resolved' : `${hoursOpen} hours open`}</td>
                          <td className="p-4">
                            <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border transition-all duration-500 ease-in-out ${
                              c.status === 'Resolved' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : c.status === 'In Progress' || c.status === 'Assigned'
                                ? 'bg-cyan-50 text-cyan-700 border-cyan-100'
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-neutral-muted">Page {currentPage} of {totalPages}</span>
                  <div className="flex space-x-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="px-3 py-1.5 bg-gray-50 border rounded-lg text-xs font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="px-3 py-1.5 bg-gray-50 border rounded-lg text-xs font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: ANALYTICS PAGE */}
          {activeTab === 'Analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Date range filter and Export */}
              <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-soft flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-neutral-muted">Range:</span>
                  <div className="flex bg-gray-50 border rounded-xl p-0.5">
                    {['7 Days', '30 Days', 'This Month'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setDateRange(range)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition-all ${
                          dateRange === range 
                            ? 'bg-white text-neutral-dark shadow-sm' 
                            : 'text-neutral-muted hover:text-neutral-dark'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleExportReport}
                  className="bg-primary hover:bg-primary-light text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-2 transition-colors shadow-soft"
                >
                  <Download className="w-4 h-4 text-accent-lime" />
                  <span>Export Report (CSV)</span>
                </button>
              </div>

              {/* Analytics Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Chart 1: Area-wise */}
                <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft space-y-4">
                  <h4 className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Area-wise Waste Generation</h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={areaGeneration} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" fontSize={10} tickLine={false} stroke="#6B7280" />
                        <YAxis fontSize={10} tickLine={false} stroke="#6B7280" />
                        <Tooltip cursor={{ fill: 'rgba(15, 81, 50, 0.03)' }} />
                        <Bar dataKey="complaints" fill="#0F5132" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: SLA trends */}
                <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft space-y-4">
                  <h4 className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Weekly Resolution SLA Trends</h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={resolutionTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="date" fontSize={10} tickLine={false} stroke="#6B7280" />
                        <YAxis fontSize={10} tickLine={false} stroke="#6B7280" />
                        <Tooltip />
                        <Line type="monotone" dataKey="resolved" stroke="#22C55E" strokeWidth={2.5} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 3: Categories Pie */}
                <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft space-y-4">
                  <h4 className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Incidents Type Breakdown</h4>
                  <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categories}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categories.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 4: Vehicle Performance */}
                <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft space-y-4">
                  <h4 className="text-xs font-bold text-neutral-dark uppercase tracking-wider">Vehicle Collection Ranking</h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vehiclePerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" fontSize={10} tickLine={false} stroke="#6B7280" />
                        <YAxis fontSize={10} tickLine={false} stroke="#6B7280" />
                        <Tooltip cursor={{ fill: 'rgba(6, 182, 212, 0.03)' }} />
                        <Bar dataKey="completed" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: VEHICLE & DRIVER MANAGEMENT */}
          {activeTab === 'Fleet' && (
            <motion.div
              key="fleet"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-neutral-dark font-heading">Fleet Vehicles & Assignments</h3>
                <button
                  onClick={() => {
                    setEditingVehicleId(null);
                    setFormVehicleId('');
                    setFormDriverId('');
                    setFormStatus('Active');
                    setFormFuelLevel(100);
                    setIsSlideOverOpen(true);
                  }}
                  className="bg-primary hover:bg-primary-light text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-soft"
                >
                  <Plus className="w-4 h-4 text-accent-lime" />
                  <span>Register Vehicle</span>
                </button>
              </div>

              {/* Vehicles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((veh) => {
                  const isActive = veh.status === 'Active';

                  return (
                    <div key={veh._id} className="p-5 bg-white border border-gray-100 rounded-3xl shadow-soft flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-premium hover:-translate-y-0.5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-accent-lime animate-pulse' : 'bg-amber-500'}`} />
                          <h4 className="font-extrabold text-sm text-neutral-dark">{veh.vehicleId}</h4>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {veh.status}
                        </span>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-gray-50">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-neutral-muted">Assigned Driver</span>
                          <span className="font-bold text-neutral-dark">{veh.driverId?.name || 'Vacant'}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-neutral-muted">Fuel Level</span>
                          <span className="font-bold text-neutral-dark">{veh.fuelLevel}%</span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleEditVehicle(veh)}
                          className="bg-gray-50 hover:bg-primary hover:text-white p-2 rounded-xl text-gray-500 transition-colors flex items-center justify-center"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      )}

      {/* BULK ACTION CONFIRMATION MODAL */}
      <AnimatePresence>
        {isBulkModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBulkModalOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white border border-gray-150 p-6 rounded-3xl shadow-premium z-50 space-y-6"
            >
              <div>
                <h4 className="font-extrabold text-sm text-neutral-dark uppercase tracking-wider">Confirm Bulk Action</h4>
                <p className="text-xs text-neutral-muted mt-2">
                  Are you sure you want to perform bulk "{bulkAction}" update on {selectedComplaints.length} selected complaints?
                </p>
              </div>

              {bulkAction === 'assign' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-dark uppercase tracking-wider">Select Dispatch Vehicle</label>
                  <select
                    value={bulkVehicleId}
                    onChange={(e) => setBulkVehicleId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none bg-white"
                  >
                    <option value="">Choose Vehicle...</option>
                    {vehicles.map((v) => (
                      <option key={v._id} value={v.vehicleId}>
                        {v.vehicleId} ({v.driverId?.name || 'Vacant'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="bg-gray-50 hover:bg-gray-150 text-gray-500 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={bulkAction === 'assign' && !bulkVehicleId}
                  onClick={handleBulkAction}
                  className="bg-primary hover:bg-primary-light text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50 shadow-soft"
                >
                  Confirm Action
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ADD/EDIT FLEET SLIDE-OVER PANEL */}
      <AnimatePresence>
        {isSlideOverOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSlideOverOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-premium p-6 flex flex-col justify-between overflow-y-auto"
            >
              <form onSubmit={handleVehicleSubmit} className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-muted uppercase tracking-widest">Fleet Operations</span>
                    <h3 className="text-lg font-extrabold text-neutral-dark font-heading mt-1">
                      {editingVehicleId ? 'Update Vehicle' : 'Register Vehicle'}
                    </h3>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsSlideOverOpen(false)}
                    className="p-2 hover:bg-gray-150 rounded-xl transition-colors text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Vehicle ID */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-dark uppercase tracking-wider">Vehicle Reference ID</label>
                    <input 
                      type="text" 
                      value={formVehicleId}
                      onChange={(e) => setFormVehicleId(e.target.value)}
                      disabled={!!editingVehicleId}
                      placeholder="e.g. VEH-ECO-08"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-primary outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Driver Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-dark uppercase tracking-wider">Assign Active Driver</label>
                    <select
                      value={formDriverId}
                      onChange={(e) => setFormDriverId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-primary outline-none bg-white"
                    >
                      <option value="">Vacant / No Driver</option>
                      {drivers.map((d) => (
                        <option key={d._id} value={d._id}>{d.name} ({d.email})</option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-dark uppercase tracking-wider">Vehicle Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-primary outline-none bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Fuel level (Only when editing) */}
                  {editingVehicleId && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-dark uppercase tracking-wider">Fuel Capacity ({formFuelLevel}%)</label>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={formFuelLevel}
                        onChange={(e) => setFormFuelLevel(parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsSlideOverOpen(false)}
                    className="w-1/2 bg-gray-50 hover:bg-gray-150 text-gray-500 font-bold py-3.5 rounded-2xl transition-colors text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-primary hover:bg-primary-light text-white font-bold py-3.5 rounded-2xl transition-colors text-xs shadow-soft"
                  >
                    Save Vehicle
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
