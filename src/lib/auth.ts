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
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
    
    if (!response.ok) {
      throw new Error('Signup failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

export const signUpWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Send the token to your backend
    const response = await fetch('/api/auth/social-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'Google',
        token: await result.user.getIdToken(),
        email: result.user.email,
        name: result.user.displayName,
      }),
    });

    if (!response.ok) {
      throw new Error('Google auth failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during Google signup:', error);
    throw error;
  }
};
