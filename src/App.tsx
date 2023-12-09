import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { Routes, Route } from 'react-router-dom';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import Assessment from './pages/assessment/Assessment';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConnectAccount from './pages/connect-account/ConnectAccount';

function App() {
  return (
    <div className="App">
      <div className='routes-container'>
        <Routes>
          <Route path={'/assessment'} element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <Assessment />
            </React.Suspense>
          } >
          </Route>
          <Route path={'/'} element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <OnboardingPage />
            </React.Suspense>
          } >
          </Route>
          <Route path={'/connectMask'} element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <ConnectAccount />
            </React.Suspense>
          } >
          </Route>
        </Routes>
      </div>

      <div>
					<ToastContainer
						position="top-center"
						autoClose={2500}
						hideProgressBar={true}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						limit={2}
						toastClassName={'theme-toast'}
					/>
				</div>
    </div>
  );
}

export default App;
