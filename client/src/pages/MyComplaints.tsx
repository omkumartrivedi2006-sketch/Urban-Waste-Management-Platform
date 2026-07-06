import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  X, 
  Calendar,
  ArrowRight
} from 'lucide-react';

const statuses = ['All', 'Pending', 'Verified', 'Assigned', 'In Progress', 'Resolved'];

export default function MyComplaints() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<any[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch complaints
  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/complaints', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
        setFilteredComplaints(data);
      }
    } catch (error) {
      console.error(error);
      showToast('Error fetching complaints.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchComplaints();
    }
  }, [token]);

  // Handle Tab Filtering
  useEffect(() => {
    if (activeTab === 'All') {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(
        complaints.filter((c) => c.status.toLowerCase() === activeTab.toLowerCase())
      );
    }
  }, [activeTab, complaints]);

  // Stepper timeline helper
  const getStepIndex = (status: string) => {
    const steps = ['Pending', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
    return steps.indexOf(status);
  };

  const stepsList = [
    { title: 'Reported', desc: 'Complaint registered by citizen' },
    { title: 'Verified', desc: 'AI / municipal agency verified validity' },
    { title: 'Assigned', desc: 'Municipal waste truck vehicle assigned' },
    { title: 'In Progress', desc: 'Waste disposal crew on site clearing pile' },
    { title: 'Resolved', desc: 'Cleared image uploaded and points credited' }
  ];

  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto font-sans min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-neutral-muted hover:text-neutral-dark flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <h2 className="text-2xl font-extrabold text-neutral-dark font-heading">My Complaints</h2>
      </div>

      {/* Tabs list with animated slide underline */}
      <div className="border-b border-gray-100 flex items-center space-x-2 overflow-x-auto pb-px mb-6 scrollbar-hide">
        {statuses.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-3 font-bold text-xs uppercase tracking-wider transition-colors select-none ${
              activeTab === tab ? 'text-primary' : 'text-neutral-muted hover:text-neutral-dark'
            }`}
          >
            <span>{tab}</span>
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Filtered list of complaints */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-white border border-gray-50 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-100 rounded-3xl shadow-soft">
          <Clock className="w-10 h-10 text-neutral-muted mx-auto mb-2" />
          <p className="text-sm font-semibold text-neutral-muted">No complaints found under "{activeTab}" status.</p>
        </div>
      ) : (
        <motion.div 
          layout 
          className="grid grid-cols-1 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredComplaints.map((complaint) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                key={complaint._id}
                onClick={() => setSelectedComplaint(complaint)}
                className="bg-white border border-gray-100 p-5 rounded-3xl shadow-soft hover:shadow-premium cursor-pointer transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:-translate-y-0.5"
              >
                <div className="flex items-start space-x-4 flex-1">
                  {complaint.imageUrl && (
                    <img 
                      src={complaint.imageUrl} 
                      alt={complaint.type} 
                      className="w-16 h-16 rounded-2xl object-cover border border-gray-100 flex-shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-sm text-neutral-dark">{complaint.type}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        complaint.status === 'Resolved' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : complaint.status === 'In Progress' || complaint.status === 'Assigned'
                          ? 'bg-cyan-50 text-cyan-700 border-cyan-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-muted flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{complaint.location?.address}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Reported: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-50">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">AI Score</p>
                    <p className="text-xs font-extrabold text-primary">{(complaint.aiConfidenceScore * 100).toFixed(0)}% Match</p>
                  </div>
                  <button className="p-2.5 bg-gray-50 hover:bg-primary hover:text-white rounded-xl text-gray-500 transition-colors flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Slide-in Detail Drawer */}
      <AnimatePresence>
        {selectedComplaint && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComplaint(null)}
              className="fixed inset-0 bg-black z-40"
            />
            {/* Drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-premium p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-muted uppercase tracking-widest">Complaint Details</span>
                    <h3 className="text-lg font-extrabold text-neutral-dark font-heading mt-1">#{selectedComplaint._id.substring(18)}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedComplaint(null)}
                    className="p-2 hover:bg-gray-150 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Complaint Basic Info */}
                <div className="space-y-4">
                  {selectedComplaint.imageUrl && (
                    <div className="w-full h-44 rounded-2xl overflow-hidden border border-gray-100 bg-slate-50">
                      <img 
                        src={selectedComplaint.imageUrl} 
                        alt="Evidence" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-bg p-3.5 rounded-2xl border border-gray-100">
                      <span className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Issue Type</span>
                      <h5 className="font-extrabold text-xs text-neutral-dark mt-0.5">{selectedComplaint.type}</h5>
                    </div>
                    <div className="bg-neutral-bg p-3.5 rounded-2xl border border-gray-100">
                      <span className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">AI Score</span>
                      <h5 className="font-extrabold text-xs text-primary mt-0.5">{(selectedComplaint.aiConfidenceScore * 100).toFixed(0)}% match</h5>
                    </div>
                  </div>

                  <div className="bg-neutral-bg p-3.5 rounded-2xl border border-gray-100 space-y-1">
                    <span className="text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Location Address</span>
                    <p className="text-xs font-bold text-neutral-dark flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{selectedComplaint.location?.address}</span>
                    </p>
                  </div>
                </div>

                {/* Vertical Stepper Timeline */}
                <div className="space-y-4 pt-4 border-t border-gray-150">
                  <h4 className="font-extrabold text-sm text-neutral-dark uppercase tracking-wider">Status Progression</h4>
                  
                  <div className="space-y-6 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                    {stepsList.map((step, idx) => {
                      const currentStatusIndex = getStepIndex(selectedComplaint.status);
                      
                      // Reported is step index 0
                      // Verified is step index 1
                      // Assigned is step index 2
                      // In Progress is step index 3
                      // Resolved is step index 4
                      
                      let isCompleted = false;
                      let isActive = false;

                      // Map:
                      // Reported (idx 0) is complete if currentStatusIndex >= 0 (always complete since reported)
                      // Verified (idx 1) is complete if currentStatusIndex >= 1
                      // Assigned (idx 2) is complete if currentStatusIndex >= 2
                      // In Progress (idx 3) is complete if currentStatusIndex >= 3
                      // Resolved (idx 4) is complete if currentStatusIndex >= 4

                      if (idx === 0) {
                        isCompleted = true;
                        if (currentStatusIndex === 0) isActive = true;
                      } else {
                        const statusMapping = ['Verified', 'Assigned', 'In Progress', 'Resolved'];
                        const mappedIndex = getStepIndex(statusMapping[idx - 1]);
                        isCompleted = currentStatusIndex >= mappedIndex;
                        if (currentStatusIndex === mappedIndex) isActive = true;
                      }

                      return (
                        <div key={idx} className="relative flex flex-col justify-start">
                          {/* Dot indicator */}
                          <div className={`absolute -left-6 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : isActive
                              ? 'bg-cyan-500 border-cyan-500 text-white animate-pulse'
                              : 'bg-white border-gray-200 text-gray-400'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-gray-300'}`} />
                            )}
                          </div>
                          
                          <div className="pl-3">
                            <h5 className={`text-xs font-bold transition-colors ${isCompleted ? 'text-neutral-dark' : 'text-neutral-muted'}`}>
                              {step.title}
                            </h5>
                            <p className="text-[10px] text-neutral-muted mt-0.5 leading-normal">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {selectedComplaint.status === 'Resolved' && (
                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl text-center space-y-1">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Points Ledger Credit</p>
                  <p className="text-sm font-extrabold text-emerald-800">+50 Recycle Points Awarded</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
