import { useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import { useSelectedObjects } from '../Context/SelectedObjectsContext';

const API = process.env.REACT_APP_API_URL;

const useUserData = () => {
  const { setCart } = useCart();
  const { setSelectedObjects } = useSelectedObjects();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API}/api/user/me`, {
          headers: { authorization: token }
        });
        if (!res.ok) return;
        const user = await res.json();

        if (user.cart?.length > 0) setCart(user.cart);
        if (user.savedLayout?.length > 0) setSelectedObjects(user.savedLayout);
      } catch (err) {
        console.error('Failed to load user data:', err);
      }
    };

    fetchUserData();
  }, []);
};

export default useUserData;