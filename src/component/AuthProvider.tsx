import React, { useCallback, useEffect, useMemo, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Collections, User } from '../types';
import AuthContext from './AuthContext';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [processingSignup, setProccessingSignup] = useState(false);
  const [processingSignin, setProccessingSignin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onUserChanged(async fbUser => {
      console.log(fbUser, '로그인한 유저');

      if (fbUser !== null) {
        setUser({
          userId: fbUser.uid,
          email: fbUser.email ?? '',
          name: fbUser.displayName ?? '',
        });
      } else {
        setUser(null);
      }
      setInitialized(true);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  //회원가입
  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      setProccessingSignup(true);
      try {
        const { user: currentUser } =
          await auth().createUserWithEmailAndPassword(email, password);
        await currentUser.updateProfile({ displayName: name });
        await firestore()
          .collection(Collections.USERS)
          .doc(currentUser.uid)
          .set({
            userId: currentUser.uid,
            email,
            name,
          });
      } finally {
        setProccessingSignup(false);
      }
    },
    [],
  );

  //로그인
  const signin = useCallback(async (email: string, password: string) => {
    setProccessingSignin(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } finally {
      setProccessingSignin(false);
    }
  }, []);
  const value = useMemo(() => {
    return {
      initialized,
      user,
      signup,
      signin,
      processingSignup,
      processingSignin,
    };
  }, [initialized, user, signup, processingSignup, signin, processingSignin]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
