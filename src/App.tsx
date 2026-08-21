// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './auth/page/LandingPage';
import AdminPage from './Admin/Pages/AdminPage';
import DoctorPage from './Doctor/Pages/DoctorPage';
import TherapistPage from './Therapist/Pages/TherapistPage';
import TherapistDashboard from './Therapist/Pages/TherapistDashboard';
import SessionQueuePage from './Therapist/Pages/SessionQueuePage';
import SessionStartPage from './Therapist/Pages/SessionStartPage';
import ActiveSessionPage from './Therapist/Pages/ActiveSessionPage';
import AvailabilityPage from './Therapist/Pages/AvailabilityPage';

const PatientDashboard = () => (
  <div className="p-10 text-2xl font-bold text-ayur-primary">
    Patient Dashboard (Coming Soon)
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Default Route: Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />

          {/* Doctor Routes */}
          <Route path="/doctor-dashboard" element={<DoctorPage />} />
          <Route path="/doctor/*" element={<DoctorPage />} />

          {/* Therapist Nested Routes */}
          <Route path="/therapist" element={<TherapistPage />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TherapistDashboard />} />
            <Route path="queue" element={<SessionQueuePage />} />
            <Route path="session/:sessionId/start" element={<SessionStartPage />} />
            <Route path="session/:sessionId/active" element={<ActiveSessionPage />} />
            <Route path="availability" element={<AvailabilityPage />} />
          </Route>
          {/* Backward-compatibility redirect */}
          <Route path="/therapist-dashboard" element={<Navigate to="/therapist/dashboard" replace />} />

          {/* Patient Routes */}
          <Route path="/patient-dashboard" element={<PatientDashboard />} />

          {/* Catch all unmatched routes and send to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;