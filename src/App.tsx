// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './auth/page/LandingPage';

// Placeholder Components for Dashboards (Hum inhe next step me design karenge)
const AdminDashboard = () => <div className="p-10 text-2xl font-bold text-ayur-primary">Admin Dashboard Prototype (Coming Next)</div>;
const DoctorDashboard = () => <div className="p-10 text-2xl font-bold text-ayur-primary">Doctor Dashboard</div>;
const TherapistDashboard = () => <div className="p-10 text-2xl font-bold text-ayur-primary">Therapist Dashboard</div>;
const PatientDashboard = () => <div className="p-10 text-2xl font-bold text-ayur-primary">Patient Dashboard (Coming Soon)</div>;


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Default Route: Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Role Based Dashboard Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />

          {/* Catch all unmatched routes and send to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;