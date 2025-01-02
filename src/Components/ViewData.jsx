import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewData = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [popupData, setPopupData] = useState(null);
  const navigate = useNavigate();
  const user_id_login = localStorage.getItem('user_id');
  const user_token = localStorage.getItem('user_token');
  useEffect(()=>{
    if(!user_token){
      navigate('/user/login')
    }
   else{
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
          params: {
            user_id: user_id_login,  // Send user_id as query parameter
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
   }
  }, []);

  const handleCheckboxChange = async (userId, isChecked) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, { isAllowed: isChecked });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAllowed: isChecked } : user
        )
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const downloadQRCode = (userName, userId) => {
    const canvas = document.createElement('canvas');
    const qrCanvas = document.getElementById(`qr-code-canvas-${userId}`);
  
    if (!qrCanvas) {
      console.error('QR Canvas not found');
      return;
    }
  
    // Increase the size for better quality
    const qrCodeSize = 500;  // Increase size for higher resolution
    const padding = 50;
  
    // Set canvas size to accommodate larger resolution
    canvas.width = qrCodeSize + padding * 2;
    canvas.height = qrCodeSize + 150;
  
    const context = canvas.getContext('2d');
  
    // Set the background to white
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Set the text style
    context.fillStyle = '#000000';
    context.font = '30px Arial'; // Increase font size for better visibility
    context.textAlign = 'center';
    context.fillText(userName, canvas.width / 2, 30);  // Adjusted position
  
    // Draw the QR code on the canvas with padding
    context.drawImage(qrCanvas, padding, 50, qrCodeSize, qrCodeSize);
  
    // Add user ID text (smaller font size for the ID)
    context.fillText(`ID: ${userId}`, canvas.width / 2, qrCodeSize + 80);
  
    // Generate a high-quality PNG image
    const pngUrl = canvas.toDataURL('image/png', 1.0); // '1.0' ensures maximum quality
  
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `${userName}-qr.png`;
    a.click();
  };

  const handleEditClick = (userId) => {
    navigate(`/edit/${userId}`);
  };

  const handleDeletebtn = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const handlePopupClose = () => {
    setPopupData(null); // Close the popup
  };

  const handleImageClick = (imageUrl) => {
    setPopupData({ type: 'image', content: imageUrl });
  };

  const handleQRCodeClick = (qrCanvasId) => {
    const qrCanvas = document.getElementById(qrCanvasId);
    if (qrCanvas) {
      const qrCodeUrl = qrCanvas.toDataURL('image/png');
      setPopupData({ type: 'qr', content: qrCodeUrl });
    }
  };

  // Filter users based on search query and status
  const filteredUsers = users.filter((user) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const matchesSearch = 
      user.name.toLowerCase().includes(lowercasedQuery) ||
      user.email.toLowerCase().includes(lowercasedQuery) ||
      user.phone.toLowerCase().includes(lowercasedQuery) ||
      user.address.toLowerCase().includes(lowercasedQuery);

    const matchesStatus =
      statusFilter === 'all' || 
      (statusFilter === 'active' && user.isAllowed) || 
      (statusFilter === 'inactive' && !user.isAllowed);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="view-data-container">
      {/* Filter Section */}
      <div className="filter-from-all-users">
        <h1>All Users</h1>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by name, email, phone, or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar-input"
          />
        </div>

        <div className="status-filter-container">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter-dropdown"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button className="add-user-btn-all-page" onClick={() => navigate('/')}>Add User</button>
      </div>

      {/* User List */}
      <div className="user-list">
        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user._id} className="user-card">
              <div className={`status-text ${user.isAllowed ? 'active' : 'inactive'}`}>
                {user.isAllowed ? 'Active' : 'Inactive'}
              </div>

              <div className="flex-jfha">
                <div className="image-name-flex">
                  {user.user_image && (
                    <img
                      src={`${user.user_image}`}
                      alt={`${user.user_image}'s profile`}
                      className="profile-image"
                      width="50px"
                      onClick={() => handleImageClick(`${user.user_image}`)} // Open in popup
                    />
                  )}
                  {user.name && <h3>{user.name}</h3>}
                </div>
                {user.email && <p>Email: {user.email}</p>}
                {user.phone && <p>Phone: {user.phone}</p>}
                {user.address && <p>Address: {user.address}</p>}

                <div className="flex-of-check-box-byn">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={user.isAllowed}
                      onChange={(e) => handleCheckboxChange(user._id, e.target.checked)}
                    />
                    <span>Show QR Code</span>
                  </label>

                  <div className="action-btn-for-each-user">
                    {/* Edit Button */}
                    <button className="edit-btn" onClick={() => handleEditClick(user._id)}>
                      <i className="ri-edit-2-line"></i>
                    </button>

                    {/* Delete Button */}
                    <button className="delete-btn" onClick={() => handleDeletebtn(user._id)}>
                      <i className="ri-delete-bin-6-line"></i>
                    </button>
                  </div>
                </div>

                {user.isAllowed && (
                  <div className="qr-code-all">
                    <QRCodeCanvas
                      id={`qr-code-canvas-${user._id}`}
                      value={`http://localhost:3000/user/${user._id}`}
                      size={70}
                      onClick={() => handleQRCodeClick(`qr-code-canvas-${user._id}`)} // Open QR in popup
                    />
                    <button className="all-users-page-download-btn-qr" onClick={() => downloadQRCode(user.name, user._id)}>
                      <i className="ri-download-line"></i>
                    </button>
                  </div>
                )}
                                                <div className="flex-name-links">
                  <p>Social Links</p>
                  <div className="links-of-each-user">
                    <div className="map-flex">
                      {user.address && (
                        <a target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${user.address}`}>
                          <i className="ri-map-pin-fill"></i>
                        </a>
                      )}
                    </div>
                    <div className="links-flex-all-user">
                      {(user.youtube_url || user.facebook_url || user.linkden_url || user.twitter_url) ? (
                        <>
                          {user.youtube_url && (
                            <a target='_blank' href={user.youtube_url}><i className="ri-youtube-fill"></i></a>
                          )}
                          {user.facebook_url && (
                            <a target='_blank' href={user.facebook_url}><i className="ri-facebook-fill"></i></a>
                          )}
                          {user.linkden_url && (
                            <a target='_blank' href={user.linkden_url}><i className="ri-linkedin-fill"></i></a>
                          )}
                          {user.twitter_url && (
                            <a target='_blank' href={user.twitter_url}><i className="ri-twitter-fill"></i></a>
                          )}
                        </>
                      ) : (
                        <h5>No social links available.</h5>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No users available.</p>
        )}
      </div>

      {/* Popup Modal */}
      {popupData && (
        <div className="popup-overlay" onClick={handlePopupClose}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            {popupData.type === 'image' ? (
              <img src={popupData.content} alt="Popup" className="popup-image" />
            ) : (
              <img src={popupData.content} alt="QR Code Popup" className="popup-qr-code" />
            )}
            <button className="close-popup-btn" onClick={handlePopupClose}>x</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewData;
