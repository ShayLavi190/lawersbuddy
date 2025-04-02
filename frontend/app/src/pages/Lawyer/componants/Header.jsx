import React from 'react';
import { BsPower, BsJustify } from 'react-icons/bs';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Header({ OpenSidebar }) {
  const handleLogOut = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div style={{ textAlign: 'center', padding: '20px', background: '#222831', borderRadius: '3%'}}>
            <p style={{ fontSize: '16px', marginBottom: '15px', direction:'rtl'}}>
              אתה בטוח שברצונך להתנתק ?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                data-testid='yes'
                onClick={() => {
                  onClose();
                  Cookies.remove('email');
                  window.location.href = '/';
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#059212',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                כן
              </button>
              <button
                data-testid='no'
                onClick={() => onClose()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#C40C0C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                לא
              </button>
            </div>
          </div>
        );
      },
      closeOnClickOutside: false,
    });
  };

  return (
    <header className='header' style={{backgroundColor:'#323232'}}>
      <ToastContainer />
      <div className='menu-icon' data-testid="menu-icon">
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>
      <div className='header-left'>
      </div>
      <div className='header-right' data-testid="power-icon">
        <BsPower className='icon' onClick={handleLogOut} tabIndex={0}   onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleLogOut();
    }
  }} />
      </div>
    </header>
  );
}

export default Header;