const API = process.env.REACT_APP_API_URL;

const getToken = () => localStorage.getItem('token');

// Cart
export const syncAddToCart = async (product) => {
  try {
    await fetch(`${API}/api/user/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: getToken()
      },
      body: JSON.stringify({
        productId: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      })
    });
  } catch (err) {
    console.error('Failed to sync cart add:', err);
  }
};

export const syncRemoveFromCart = async (productId) => {
  try {
    await fetch(`${API}/api/user/cart/${productId}`, {
      method: 'DELETE',
      headers: { authorization: getToken() }
    });
  } catch (err) {
    console.error('Failed to sync cart remove:', err);
  }
};

export const syncClearCart = async () => {
  try {
    await fetch(`${API}/api/user/cart`, {
      method: 'DELETE',
      headers: { authorization: getToken() }
    });
  } catch (err) {
    console.error('Failed to sync cart clear:', err);
  }
};

// Wishlist
export const syncAddToWishlist = async (product) => {
  try {
    await fetch(`${API}/api/user/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: getToken()
      },
      body: JSON.stringify({
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      })
    });
  } catch (err) {
    console.error('Failed to sync wishlist add:', err);
  }
};

export const syncRemoveFromWishlist = async (productId) => {
  try {
    await fetch(`${API}/api/user/wishlist/${productId}`, {
      method: 'DELETE',
      headers: { authorization: getToken() }
    });
  } catch (err) {
    console.error('Failed to sync wishlist remove:', err);
  }
};

// Layout
export const syncSaveLayout = async (products) => {
  try {
    await fetch(`${API}/api/user/layout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: getToken()
      },
      body: JSON.stringify({ products })
    });
  } catch (err) {
    console.error('Failed to sync layout:', err);
  }
};

//AR History
export const syncSaveArSession = async (products) => {
  try {
    await fetch(`${API}/api/user/ar-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: getToken()
      },
      body: JSON.stringify({ products })
    });
  } catch (err) {
    console.error('Failed to sync AR session:', err);
  }
};