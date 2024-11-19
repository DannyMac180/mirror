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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();

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
    // Sign in with Google popup
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Send user data to our backend
    const response = await fetch('http://localhost:8000/auth/google-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        name: user.displayName,
        provider: 'google',
        // Include the Google ID token for verification
        idToken: await user.getIdToken(),
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || data.error || 'Google signup failed');
    }
    
    return data;
  } catch (error) {
    console.error('Detailed error during Google signup:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to sign up with Google');
    }
  }
};
