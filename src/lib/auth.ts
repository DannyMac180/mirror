import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check if Firebase config is properly set
const isFirebaseConfigValid = Object.values(firebaseConfig).every(value => value !== undefined && value !== '');
if (!isFirebaseConfigValid) {
  console.error('Firebase configuration is incomplete. Please check your environment variables.');
}

// Initialize Firebase
let app;
let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    console.log('Attempting to sign up with:', { email, name }); // Debug log
    
    const response = await fetch('http://localhost:8000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
    
    console.log('Response status:', response.status); // Debug log
    
    const data = await response.json();
    console.log('Response data:', data); // Debug log
    
    if (!response.ok) {
      throw new Error(data.detail || data.error || 'Signup failed');
    }
    
    return data;
  } catch (error) {
    console.error('Detailed error during signup:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to sign up');
    }
  }
};

export const signUpWithGoogle = async () => {
  try {
    console.log('Starting Google sign-up process...');
    
    // Sign in with Google popup
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    console.log('Google sign-in successful:', {
      email: user.email,
      name: user.displayName,
    });
    
    // Get the ID token
    const idToken = await user.getIdToken();
    console.log('Got ID token:', idToken.substring(0, 20) + '...');
    
    // Send user data to our backend
    console.log('Sending data to backend...');
    const response = await fetch('http://localhost:8000/auth/google-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        name: user.displayName,
        provider: 'google',
        idToken: idToken,
      }),
    });

    console.log('Backend response status:', response.status);
    const data = await response.json();
    console.log('Backend response data:', data);
    
    if (!response.ok) {
      console.error('Backend error:', data);
      throw new Error(data.detail || data.error || 'Google signup failed');
    }
    
    return data;
  } catch (error) {
    console.error('Detailed error during Google signup:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    } else {
      console.error('Unknown error type:', error);
      throw new Error('Failed to sign up with Google');
    }
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || data.error || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to sign in');
    }
  }
};

export const signInWithGoogle = async () => {
  try {
    if (!auth || !googleProvider) {
      throw new Error('Firebase authentication is not properly initialized');
    }

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    if (!user.email) {
      throw new Error('No email provided from Google account');
    }

    // Send the Google user data to your backend
    const response = await fetch('http://localhost:8000/auth/google-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        name: user.displayName || '',
        googleId: user.uid,
      }),
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || data.error || `Google login failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Detailed error during Google sign-in:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to sign in with Google');
    }
  }
};
