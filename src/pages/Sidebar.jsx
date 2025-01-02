import React, { useEffect, useState } from 'react';
import './Sidebar.css'; // Import external CSS
import AllQrCodeCall from '../Dashboard/UserDashboard/allcomponentsCall/allqrcodecall/AllQrCodeCall';
import Allmygeneratedheader from '../Dashboard/UserDashboard/allcomponentsCall/allgeneratedqrcodescall/myqrCode/allmygeneratedheader';
import CreditsSelection from '../payments/CreditSelection';
import Settings from '../Dashboard/UserDashboard/Settings/Settings';
const Sidebar = () => {
  
  const [selected, setSelected] = useState('MyQRCodes');


  const menuItems = [
    { id: 'GenerateQR', label: 'Generate QR Code' },
    { id: 'MyQRCodes', label: 'My QR Codes' },
    { id: 'Settings', label: 'Settings' },
    { id: 'PlansPayments', label: 'Plans & Payments' },
  ];
  
  return (
    <div className="sidebar-container">
      {/* Sidebar */}
      <div className="sidebar">
        <nav>
          <ul>  
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={selected === item.id ? 'menu-item active' : 'menu-item'}
                onClick={() => setSelected(item.id)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
        <button className="logout-button" onClick={() => alert('Logging out...')}>
          Logout
        </button>
      </div>

      <div className="content">
   
        {selected === 'GenerateQR' &&
        <AllQrCodeCall />
        }
        {selected === 'MyQRCodes' &&
        <Allmygeneratedheader />
        }
        {selected === 'Settings' &&
        <Settings />
        }
        {selected === 'PlansPayments' &&
        <CreditsSelection />
        }
      </div>
    </div>
  );
};

export default Sidebar;
