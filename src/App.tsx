import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { Routes, Route } from 'react-router-dom';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import Assessment from './pages/assessment/Assessment';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Survey from './pages/survey/Survey';
import Thankyou from './pages/thank-you/Thankyou';
import ConnectAccount from './pages/connect-account/ConnectAccount';

import { createContext } from 'react';
import { getDataFromLocalStorage } from './utils/globalUtilities';

export const UserContext = createContext<{
  isLoggedIn: boolean,
  userDetails: any;
}>({ isLoggedIn: false, userDetails: null });

function App() {


  const [userDetails, setUserDetails] = useState<any>()

  //effect me local se nikalke agar not null hai to setUserDetails kardo
  const getUserDetails=getDataFromLocalStorage('userDetails')
  useEffect(()=>{
     if(getUserDetails){
           setUserDetails(JSON.parse( getUserDetails))
     }
  },[getUserDetails])
  return (
    <div className="App">
      <UserContext.Provider value={userDetails}>
        <div className='routes-container'>
          <Routes>
            <Route path={'/'} element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <ConnectAccount setUserDetails={setUserDetails} />
              </React.Suspense>
            } >
            </Route>
            <Route path={'/survey/:surveyId'} element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Assessment />
              </React.Suspense>
            } ></Route>
            <Route path={'/surveys'} element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Survey />
              </React.Suspense>
            } ></Route>
            <Route path={'/thankyou'} element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Thankyou />
              </React.Suspense>
            } ></Route>
            {/* <Route path={'/connectMask'} element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <ConnectAccount />
            </React.Suspense>
          } >
          </Route> */}
          </Routes>
        </div>
      </UserContext.Provider>


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
