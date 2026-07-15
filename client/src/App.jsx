import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import DashboardLayout from './components/layout/DashboardLayout'

// Lazy-loaded pages for performance
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const Documents = lazy(() => import('./pages/Documents'))
const Applications = lazy(() => import('./pages/Applications'))
const DemoForm = lazy(() => import('./pages/DemoForm'))
const Extension = lazy(() => import('./pages/Extension'))
const Settings = lazy(() => import('./pages/Settings'))
const History = lazy(() => import('./pages/History'))
const JobAssistant = lazy(() => import('./pages/JobAssistant'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="h-8 w-8 rounded-full border-2 border-[#4F8CFF] border-t-transparent animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth signup />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/demo" element={<DemoForm />} />
          <Route path="/extension" element={<Extension />} />
          <Route path="/history" element={<History />} />
          <Route path="/job-assistant" element={<JobAssistant />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
