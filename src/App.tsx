// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { LandingPage } from './auth/page/LandingPage';
import AdminPage from './Admin/Pages/AdminPage';

// Beautiful Clinical Placeholders
const DoctorDashboard = () => (
  <div className="min-h-screen bg-[#fbf9f6] p-8 flex flex-col items-center justify-center font-sans antialiased text-slate-800">
    <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-850">Doctor Clinical Workspace</h1>
          <p className="text-xs text-slate-450 mt-0.5">AyurSutra Panchakarma Treatment & Prakriti Suite</p>
        </div>
        <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
          AYUSH Certified
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
          <span className="text-2xl font-bold text-emerald-900">14</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Prakriti Analysis</p>
        </div>
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
          <span className="text-2xl font-bold text-amber-800">3</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Pending Diet Audits</p>
        </div>
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
          <span className="text-2xl font-bold text-slate-700">42</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Active Patients</p>
        </div>
      </div>
      <p className="text-xs text-slate-550 leading-relaxed mb-6">
        Welcome, Doctor. Use this clinical interface to prescribe tailored therapy packages, review Prakriti questionnaire responses, configure custom herbal compositions, and monitor patient treatment lifecycles.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => alert("Simulating: AI Diet Plan Generation...")}
          className="flex-1 rounded-xl bg-emerald-900 py-3 text-xs font-bold text-white hover:bg-emerald-950 transition"
        >
          Generate AI Diet Plan
        </button>
        <Link 
          to="/"
          className="rounded-xl border border-slate-200 bg-slate-50 py-3 px-6 text-xs font-bold text-slate-600 hover:bg-slate-100 transition text-center"
        >
          Sign Out
        </Link>
      </div>
    </div>
  </div>
);

const TherapistDashboard = () => (
  <div className="min-h-screen bg-[#fbf9f6] p-8 flex flex-col items-center justify-center font-sans antialiased text-slate-800">
    <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-850">Therapist Procedures Hub</h1>
          <p className="text-xs text-slate-450 mt-0.5">AyurSutra Treatment Execution & Room Logs</p>
        </div>
        <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
          Procedure Active
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
          <span className="text-2xl font-bold text-amber-800">5</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Scheduled Today</p>
        </div>
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
          <span className="text-2xl font-bold text-teal-800">2</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Pending Sanitization</p>
        </div>
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
          <span className="text-2xl font-bold text-slate-700">12</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Completed Procedures</p>
        </div>
      </div>
      <p className="text-xs text-slate-550 leading-relaxed mb-6">
        Welcome, Therapist. Use this clinical interface to view your assigned Abhyanga, Swedana, or Shirodhara slots, mark chambers as clean, log procedure observations, and view same-gender matching constraints.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => alert("Simulating: Chamber Sanitization Log...")}
          className="flex-1 rounded-xl bg-emerald-900 py-3 text-xs font-bold text-white hover:bg-emerald-950 transition"
        >
          Log Sanitization Complete
        </button>
        <Link 
          to="/"
          className="rounded-xl border border-slate-200 bg-slate-50 py-3 px-6 text-xs font-bold text-slate-600 hover:bg-slate-100 transition text-center"
        >
          Sign Out
        </Link>
      </div>
    </div>
  </div>
);

const SoloPractitionerDashboard = () => (
  <div className="min-h-screen bg-[#fbf9f6] p-8 flex flex-col items-center justify-center font-sans antialiased text-slate-800">
    <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-850">Solo Practitioner Portal</h1>
          <p className="text-xs text-slate-450 mt-0.5">Independent Ayurvedic Doctor Suite</p>
        </div>
        <span className="rounded bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
          Solo Mode Active
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
          <span className="text-2xl font-bold text-emerald-900">18</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Total Patients</p>
        </div>
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
          <span className="text-2xl font-bold text-teal-800">4</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Basti Sessions</p>
        </div>
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
          <span className="text-2xl font-bold text-slate-700">₹42.5k</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Monthly Billing</p>
        </div>
      </div>
      <p className="text-xs text-slate-550 leading-relaxed mb-6">
        Welcome to Solo Mode. This workspace combines scheduling, client database management, and treatment logs into one cohesive panel. Perfect for private clinics without administrative staff.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => alert("Simulating: Custom Billing Invoice...")}
          className="flex-1 rounded-xl bg-emerald-900 py-3 text-xs font-bold text-white hover:bg-emerald-950 transition"
        >
          Create Invoice
        </button>
        <Link 
          to="/"
          className="rounded-xl border border-slate-200 bg-slate-50 py-3 px-6 text-xs font-bold text-slate-600 hover:bg-slate-100 transition text-center"
        >
          Sign Out
        </Link>
      </div>
    </div>
  </div>
);

const PatientDashboard = () => (
  <div className="min-h-screen bg-[#fbf9f6] p-8 flex flex-col items-center justify-center font-sans antialiased text-slate-800">
    <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-850">Patient Health Portal</h1>
          <p className="text-xs text-slate-450 mt-0.5">My Ayurvedic Wellness & Diet Tracker</p>
        </div>
        <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
          Vata-Pitta Profile
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded">Taken</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2.5">Herbal Tea</p>
        </div>
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
          <span className="text-2xl font-bold text-amber-800">2</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Logged Symptoms</p>
        </div>
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Tomorrow</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2.5">Next Abhyanga</p>
        </div>
      </div>
      <p className="text-xs text-slate-550 leading-relaxed mb-6">
        Welcome to your health dashboard. View dietary constraints prescribed by your doctor, track your daily water intake, complete clinical symptom checkups, and view your upcoming Panchakarma procedure calendar.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => alert("Simulating: Daily Symptom Log...")}
          className="flex-1 rounded-xl bg-emerald-900 py-3 text-xs font-bold text-white hover:bg-emerald-950 transition"
        >
          Log Daily Symptoms
        </button>
        <Link 
          to="/"
          className="rounded-xl border border-slate-200 bg-slate-50 py-3 px-6 text-xs font-bold text-slate-600 hover:bg-slate-100 transition text-center"
        >
          Sign Out
        </Link>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Default Route: Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Role Based Dashboard Routes */}
          <Route path="/admin-dashboard" element={<AdminPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
          <Route path="/solo-practitioner-dashboard" element={<SoloPractitionerDashboard />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />

          {/* Catch all unmatched routes and send to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;