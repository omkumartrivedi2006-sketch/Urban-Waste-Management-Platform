import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  ChevronLeft, 
  Battery, 
  Compass, 
  Settings, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// Mock Recharts Data
const weeklyTripsData = [
  { name: 'Mon', trips: 4 },
  { name: 'Tue', trips: 5 },
  { name: 'Wed', trips: 3 },
  { name: 'Thu', trips: 6 },
  { name: 'Fri', trips: 4 },
  { name: 'Sat', trips: 2 },
  { name: 'Sun', trips: 1 },
];

const COLORS = ['#0F5132', '#CBD5E1'];

export default function VehicleDashboard() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Driver Vehicle Details
  useEffect(() => {
    const fetchVehicleData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/vehicles/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setVehicle(data);
        }
      } catch (error) {
        console.error(error);
        showToast('Error syncing vehicle telemetry.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchVehicleData();
    }
  }, [token]);

  // SVG Progress Ring calculations for Fuel Level
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const fuelVal = vehicle?.fuelLevel || 0;
  const strokeDashoffset = circumference - (fuelVal / 100) * circumference;

  // Pie chart data for completed vs pending stops
  const pieData = [
    { name: 'Completed Pickups', value: 14 },
    { name: 'Pending Pickups', value: 3 }
  ];

  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto font-sans min-h-screen space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/driver')}
          className="text-neutral-muted hover:text-neutral-dark flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Driver Dashboard</span>
        </button>
        <h2 className="text-2xl font-extrabold text-neutral-dark font-heading">Vehicle Telematics</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-white border border-gray-50 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : !vehicle ? (
        <div className="p-8 text-center bg-white border border-gray-100 rounded-3xl shadow-soft">
          <AlertCircle className="w-8 h-8 text-neutral-muted mx-auto mb-2" />
          <p className="text-sm font-semibold text-neutral-muted">No vehicle assignment recorded.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Fuel circular gauge & Basic Status */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft flex flex-col justify-between items-center text-center space-y-6">
            <div>
              <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {vehicle.vehicleId}
              </span>
              <h3 className="text-md font-extrabold text-neutral-dark font-heading mt-3">Fuel Level Telemetry</h3>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-gray-100"
                  strokeWidth="10"
                  fill="transparent"
                />
                <motion.circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-primary"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-neutral-dark font-heading">{fuelVal}%</span>
                <span className="text-[9px] font-bold text-neutral-muted uppercase tracking-wider">CAPACITY</span>
              </div>
            </div>

            {/* Diagnostics Stats */}
            <div className="w-full grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
              <div className="flex flex-col items-center">
                <Battery className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[10px] text-gray-400 font-semibold">BATTERY</span>
                <span className="text-xs font-bold text-emerald-600">GOOD</span>
              </div>
              <div className="flex flex-col items-center">
                <Compass className="w-5 h-5 text-primary mb-1" />
                <span className="text-[10px] text-gray-400 font-semibold">GPS</span>
                <span className="text-xs font-bold text-primary">ONLINE</span>
              </div>
              <div className="flex flex-col items-center">
                <Settings className="w-5 h-5 text-cyan-600 mb-1" />
                <span className="text-[10px] text-gray-400 font-semibold">ENGINE</span>
                <span className="text-xs font-bold text-cyan-600">OK</span>
              </div>
            </div>
          </div>

          {/* Recharts Donuts (Completed vs Pending) & Maintenance */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-neutral-dark font-heading">Stops Clearance Ratio</h3>
              <p className="text-xs text-neutral-muted mt-1">Trips metrics recorded this week.</p>
            </div>

            {/* Recharts Pie Chart */}
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend / Metrics summary */}
            <div className="flex justify-around text-center text-xs">
              <div>
                <span className="inline-block w-2.5 h-2.5 bg-primary rounded-full mr-1.5" />
                <span className="font-semibold text-neutral-muted">Completed (14)</span>
              </div>
              <div>
                <span className="inline-block w-2.5 h-2.5 bg-slate-300 rounded-full mr-1.5" />
                <span className="font-semibold text-neutral-muted">Pending (3)</span>
              </div>
            </div>
          </div>

          {/* Weekly trips Recharts Bar Chart */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-soft flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-neutral-dark font-heading">Completed Trips Weekly Ledger</h3>
              <p className="text-xs text-neutral-muted mt-1">Trips dispatched per day.</p>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTripsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6B7280" fontSize={10} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(15, 81, 50, 0.05)' }} />
                  <Bar dataKey="trips" fill="#0F5132" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Last Maintenance info */}
            <div className="bg-neutral-bg p-3.5 rounded-2xl border border-gray-100 flex items-center space-x-3.5">
              <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Last Maintenance Checked</p>
                <p className="text-xs font-extrabold text-neutral-dark mt-0.5">
                  {new Date(vehicle.lastMaintenance).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
