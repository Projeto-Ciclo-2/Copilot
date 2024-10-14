import React, { useState } from 'react';
import './css/AuthPage.css';
import LoginForm from '../components/loginForm';
import SignupForm from '../components/singupForm';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const handleTabSwitch = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
  };

  return (
    <div className="page">

    <div className="auth-container">
      <div className="tab-container">
        <button
          onClick={() => handleTabSwitch('login')}
          className={`tab-button ${activeTab === 'login' ? 'active-tab' : 'inactive-tab'}`}
          >
          Login
        </button>
        <button
          onClick={() => handleTabSwitch('signup')}
          className={`tab-button ${activeTab === 'signup' ? 'active-tab' : 'inactive-tab'}`}
          >
          Cadastro
        </button>
      </div>
      <div className="form-container">
        {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
</div>
  );
};
export default AuthPage;
