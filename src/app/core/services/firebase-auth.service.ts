import { Injectable, inject } from '@angular/core';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';
import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private notificationService = inject(NotificationService);

  constructor() {
    this.initFirebase();
  }

  private initFirebase() {
    try {
      if (!getApps().length) {
        initializeApp(environment.firebase);
      }
    } catch (e) {
      console.warn('Firebase initialization notice:', e);
    }
  }

  async signInWithGoogle(): Promise<{ email: string; name: string; firebaseUid: string; photoUrl: string; idToken: string } | null> {
    try {
      this.initFirebase();
      const app = getApp();
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result: UserCredential = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user || !user.email) {
        this.notificationService.error('Google Sign-In', 'Could not retrieve email from Google Account.');
        return null;
      }

      const idToken = await user.getIdToken();

      return {
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        firebaseUid: user.uid,
        photoUrl: user.photoURL || '',
        idToken: idToken
      };
    } catch (error: any) {
      console.error('Firebase Google Auth error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        this.notificationService.error('Google Sign-In Error', error.message || 'Failed to authenticate with Google');
      }
      return null;
    }
  }
}
