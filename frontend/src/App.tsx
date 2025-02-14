import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import DiaryList from './components/DiaryList';
import DiaryForm from './components/DiaryForm';
import Content from './components/Content';
import ProtectedRoute from './components/ProtectedRoute';


const App: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="content">
          <Content />
          <Routes>

            {/* Protected route for diary list */}
            <Route path="/diary-list" element={<ProtectedRoute component={DiaryList} />} />

            {/* Protected route for creating a new diary entry */}
            <Route
              path="/diary-form/new"
              element={< ProtectedRoute component={DiaryForm} mode="create" />}
            />

            {/* Protected route for editing an existing diary entry */}
            <Route
              path="/diary-form/edit/:id"
              element={< ProtectedRoute component={DiaryForm} mode="edit" />}
            />
          </Routes>
        </div>
        <Footer />

        {showLoginModal && <LoginModal onClose={handleCloseModal} />}
        {showRegisterModal && <RegisterModal onClose={handleCloseModal} />}
      </div>
    </Router>
  );
};

export default App;
