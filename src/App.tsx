// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './auth/page/LandingPage';
import AdminPage from './admin/Pages/AdminPage';
import DoctorPage from './Doctor/Pages/DoctorPage';
import TherapistPage from './Therapist/Pages/TherapistPage';
import TherapistDashboard from './Therapist/Pages/TherapistDashboard';
import SessionQueuePage from './Therapist/Pages/SessionQueuePage';
import SessionStartPage from './Therapist/Pages/SessionStartPage';
import ActiveSessionPage from './Therapist/Pages/ActiveSessionPage';
import AvailabilityPage from './Therapist/Pages/AvailabilityPage';

import PatientPage from './Patient/Pages/PatientPage';
import PatientDashboard from './Patient/Pages/PatientDashboard';
import MyTherapyPlanPage from './Patient/Pages/MyTherapyPlanPage';
import AppointmentsPage from './Patient/Pages/AppointmentsPage';
import FeedbackPage from './Patient/Pages/FeedbackPage';
import ProfilePage from './Patient/Pages/ProfilePage';

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
          {/* Patient Nested Routes */}
          <Route path="/patient" element={<PatientPage />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="therapy-plan" element={<MyTherapyPlanPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          {/* Backward-compatibility redirects */}
          <Route path="/therapist-dashboard" element={<Navigate to="/therapist/dashboard" replace />} />
          <Route path="/patient-dashboard" element={<Navigate to="/patient/dashboard" replace />} />

          {/* Catch all unmatched routes and send to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;