// Profil.tsx
import { useEffect, useState, useContext } from 'react';
import axios from '../../../axios/api';
import Cookies from 'js-cookie';

const Profil = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get('user_token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className='text-lilac'>
      <h1>User Profile</h1>
      <p>Username: {userData.username}</p>
      <p>Email: {userData.email}</p>
      {/* Autres données utilisateur */}
    </div>
  );
};

export default Profil;
