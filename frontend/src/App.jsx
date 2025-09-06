import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import HomePage from './pages/HomePage';
import Logout from './pages/Auth/Logout';
import ApproveGuides from './pages/Admin/ApproveGuides'
import CreateEventForm from './pages/Admin/CreateEventForm';
import ManageEvents from './pages/Admin/ManageEvents';
import StudentEvents from './pages/Student/StudentEvents';
import UpdateEventForm from './pages/Admin/UpdateEventForm';
import AssignedEvents from './pages/Guide/AssignedEvents';
import EventRegistrations from './pages/Guide/EventRegistrations';
import UpdateProfile from './pages/UpdateProfile';
import UploadNotice from './pages/UploadNotice';
import NoticeList from './pages/Student/NoticeList';
import Gallery from './pages/Admin/Gallery';
import Contact from './pages/Contact'
import ManageNotices from './pages/Admin/ManageNotices';
const App = () => {
  return (
    <>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/approve-guides" element={<ApproveGuides />} />
        <Route path="/create-event" element={<CreateEventForm />} />
        <Route path="/manage-events" element={<ManageEvents />} />
        <Route path="/profile" element={<UpdateProfile />} />
        <Route path="/events" element={<StudentEvents />} />
        <Route path="/update-event/:eventId" element={<UpdateEventForm />} />
        <Route path="/assigned-events" element={<AssignedEvents />} />
        <Route path="/event-registrations/:eventId" element={<EventRegistrations />} />
        <Route path="/upload-notice" element={<UploadNotice />} />
        <Route path="/notice" element={<NoticeList />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/manage-notice" element={<ManageNotices />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  )
}

export default App
