import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import NetworkStatus from './Pages/NetworkStatus';
import Register from './Pages/Register';
import ProfilePage from './Pages/ProfilePage';
import ProtectedRoute from './Pages/ProtectedRoute';
import UpdateProfile from './Pages/UpdateProfile';
import Notifications from './Pages/Notifications';
import NotFound from './Pages/NotFound';


const App = () => {
  return (
    <div>
      {/* display network status at the top */}
      <NetworkStatus />
      <Routes>
        <Route path='/' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
  
    
        <Route 
         path="/profile/:id"
        element={
           <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
        }
        />
       <Route
          path="/profile/edit/:id"
          element={
            <ProtectedRoute>
             <UpdateProfile /> 
            </ProtectedRoute>
          }
        />
        <Route
        path="/notifications/:id"
        element={
          <ProtectedRoute>
            <Notifications/>
          </ProtectedRoute>
        }
        /> 
        <Route
        path='*'
        element={
          <ProtectedRoute>
            <NotFound/>
          </ProtectedRoute>
        }
        />
      </Routes>
    </div>
  );
};

export default App;