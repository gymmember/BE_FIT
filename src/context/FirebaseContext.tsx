import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "../firebase";

export interface UserProfile {
  userId: string;
  weight: number;
  height: number;
  bmi: number;
  category: string;
  goal: string;
  updatedAt: any;
}

export interface Booking {
  bookingId: string;
  userId: string;
  userName: string;
  userPhone: string;
  classId: string;
  classTitle: string;
  trainerName: string;
  scheduleTime: string;
  createdAt: any;
}

export interface MembershipPass {
  passId: string;
  userId: string;
  clientName: string;
  planId: string;
  planName: string;
  payablePrice: string;
  sessionFrequency: number;
  createdAt: any;
}

export interface ChatMessageLog {
  messageId: string;
  sender: "user" | "bot";
  text: string;
  createdAt: any;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  isPopular?: boolean;
  features: string[];
  order: number;
}

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  userProfile: UserProfile | null;
  bookings: Booking[];
  passes: MembershipPass[];
  chatMessages: ChatMessageLog[];
  allUserProfiles: UserProfile[];
  plans: PricingPlan[];
  loginWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  saveUserProfile: (weight: number, height: number, bmi: number, category: string, goal: string) => Promise<void>;
  addBooking: (
    classId: string,
    classTitle: string,
    trainerName: string,
    scheduleTime: string,
    userName: string,
    userPhone: string
  ) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  addPass: (
    clientName: string,
    planId: string,
    planName: string,
    payablePrice: string,
    sessionFrequency: number
  ) => Promise<void>;
  sendChatMessage: (text: string, sender: "user" | "bot") => Promise<void>;
  updatePlan: (plan: PricingPlan) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [passes, setPasses] = useState<MembershipPass[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageLog[]>([]);
  const [allUserProfiles, setAllUserProfiles] = useState<UserProfile[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserProfile(null);
        setBookings([]);
        setPasses([]);
        setChatMessages([]);
        setAllUserProfiles([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 1b. Fetch Plans (publicly accessible)
  useEffect(() => {
    const collectionPath = "plans";
    const q = query(collection(db, collectionPath), orderBy("order", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnap) => {
        const tempPlans: PricingPlan[] = [];
        querySnap.forEach((docSnap) => {
          tempPlans.push(docSnap.data() as PricingPlan);
        });
        setPlans(tempPlans);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, collectionPath);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Load User Profile when logged in
  useEffect(() => {
    if (!user) return;

    const docPath = `user_profiles/${user.uid}`;
    const unsubscribe = onSnapshot(
      doc(db, "user_profiles", user.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          setUserProfile(null);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, docPath);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 3. Sync user's personal Bookings
  useEffect(() => {
    if (!user) return;

    const collectionPath = "bookings";
    const q = user.email === "gymadmin@gmail.com"
      ? query(collection(db, collectionPath))
      : query(collection(db, collectionPath), where("userId", "==", user.uid));
    
    const unsubscribe = onSnapshot(
      q,
      (querySnap) => {
        const tempBookings: Booking[] = [];
        querySnap.forEach((docSnap) => {
          tempBookings.push(docSnap.data() as Booking);
        });
        setBookings(tempBookings.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, collectionPath);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 4. Sync user's physical passes
  useEffect(() => {
    if (!user) return;

    const collectionPath = "passes";
    const q = user.email === "gymadmin@gmail.com"
      ? query(collection(db, collectionPath))
      : query(collection(db, collectionPath), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (querySnap) => {
        const tempPasses: MembershipPass[] = [];
        querySnap.forEach((docSnap) => {
          tempPasses.push(docSnap.data() as MembershipPass);
        });
        setPasses(tempPasses.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, collectionPath);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 4b. Sync all user profiles for Admin
  useEffect(() => {
    if (!user || user.email !== "gymadmin@gmail.com") {
      setAllUserProfiles([]);
      return;
    }

    const collectionPath = "user_profiles";
    const q = query(collection(db, collectionPath));

    const unsubscribe = onSnapshot(
      q,
      (querySnap) => {
        const tempProfiles: UserProfile[] = [];
        querySnap.forEach((docSnap) => {
          tempProfiles.push(docSnap.data() as UserProfile);
        });
        setAllUserProfiles(tempProfiles);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, collectionPath);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 5. Sync Chat messages thread
  useEffect(() => {
    if (!user) return;

    const collectionPath = `user_profiles/${user.uid}/chats`;
    const q = query(collection(db, "user_profiles", user.uid, "chats"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnap) => {
        const tempMessages: ChatMessageLog[] = [];
        querySnap.forEach((docSnap) => {
          tempMessages.push(docSnap.data() as ChatMessageLog);
        });
        setChatMessages(tempMessages);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, collectionPath);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Trigger Sign-in
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Popup authentication failed:", e);
    }
  };

  // Trigger Email/Password creation
  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        setUser({ ...userCredential.user, displayName });
      }
    } catch (e) {
      console.error("Email signup failed:", e);
      throw e;
    }
  };

  // Trigger Email/Password Sign-In
  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      if (email === "gymadmin@gmail.com" && password === "090909") {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          if (userCredential.user) {
            await updateProfile(userCredential.user, { displayName: "Gym Admin" });
            setUser({ ...userCredential.user, displayName: "Gym Admin" });
          }
          return;
        } catch (signUpErr) {
          console.error("Auto admin signup failed:", signUpErr);
        }
      }
      console.error("Email login failed:", e);
      throw e;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  // Create or Update User Profile metrics
  const saveUserProfile = async (weight: number, height: number, bmi: number, category: string, goal: string) => {
    if (!user) return;
    const path = `user_profiles/${user.uid}`;
    try {
      const docRef = doc(db, "user_profiles", user.uid);
      await setDoc(docRef, {
        userId: user.uid,
        weight,
        height,
        bmi,
        category,
        goal,
        updatedAt: new Date() // Firebase rules support comparing date instances / request.time
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Append new booking reservation
  const addBooking = async (
    classId: string,
    classTitle: string,
    trainerName: string,
    scheduleTime: string,
    userName: string,
    userPhone: string
  ) => {
    if (!user) return;
    const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const path = `bookings/${bookingId}`;
    try {
      const docRef = doc(db, "bookings", bookingId);
      await setDoc(docRef, {
        bookingId,
        userId: user.uid,
        userName,
        userPhone,
        classId,
        classTitle,
        trainerName,
        scheduleTime,
        createdAt: new Date()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Cancel registered classes
  const cancelBooking = async (bookingId: string) => {
    if (!user) return;
    const path = `bookings/${bookingId}`;
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  // Save purchased digital membership pass
  const addPass = async (
    clientName: string,
    planId: string,
    planName: string,
    payablePrice: string,
    sessionFrequency: number
  ) => {
    if (!user) return;
    const passId = `ps_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const path = `passes/${passId}`;
    try {
      const docRef = doc(db, "passes", passId);
      await setDoc(docRef, {
        passId,
        userId: user.uid,
        clientName,
        planId,
        planName,
        payablePrice,
        sessionFrequency,
        createdAt: new Date()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Send chatbot logs
  const sendChatMessage = async (text: string, sender: "user" | "bot") => {
    if (!user) return;
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const path = `user_profiles/${user.uid}/chats/${messageId}`;
    try {
      const docRef = doc(db, "user_profiles", user.uid, "chats", messageId);
      await setDoc(docRef, {
        messageId,
        sender,
        text,
        createdAt: new Date()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const updatePlan = async (plan: PricingPlan) => {
    if (!user || user.email !== "gymadmin@gmail.com") return;
    // Auto-generate id if new
    const finalPlan = { ...plan };
    if (!finalPlan.id) {
        finalPlan.id = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    }
    const path = `plans/${finalPlan.id}`;
    try {
        await setDoc(doc(db, "plans", finalPlan.id), finalPlan);
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const deletePlan = async (planId: string) => {
    if (!user || user.email !== "gymadmin@gmail.com") return;
    const path = `plans/${planId}`;
    try {
        await deleteDoc(doc(db, "plans", planId));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        userProfile,
        bookings,
        passes,
        chatMessages,
        allUserProfiles,
        plans,
        loginWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logout,
        saveUserProfile,
        addBooking,
        cancelBooking,
        addPass,
        sendChatMessage,
        updatePlan,
        deletePlan
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}
