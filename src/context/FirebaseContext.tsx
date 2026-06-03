import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { JoinRequest } from "../types";
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
import { PRICING_PLANS } from "../data";

export interface UserProfile {
  userId: string;
  weight: number;
  height: number;
  bmi: number;
  category: string;
  goal: string;
  updatedAt: any;
  displayName?: string;
  email?: string;
  isPhysicalMemberVerified?: boolean;
  physicalMemberCardId?: string;
  physicalMemberName?: string;
  physicalMemberPhone?: string;
  physicalMemberLocation?: string;
  physicalMemberGender?: string;
  physicalMemberAge?: string;
  physicalMemberJoinDate?: string;
  physicalMemberAddress?: string;
  physicalMemberPlan?: string;
  physicalMemberGoal?: string;
  physicalMemberHeight?: number;
  physicalMemberWeight?: number;
  physicalMemberBmi?: number;
  physicalMemberPaidAmount?: number;
  physicalMemberRemainingAmount?: number;
  physicalMemberWorkoutPlan?: string;
  physicalMemberPlanStartDate?: string;
  physicalMemberPlanEndDate?: string;
  physicalMemberPayments?: { month: string; status: string; amount: number; date: string }[];
  physicalMemberVerifiedAt?: string;
  physicalMemberRequestedAt?: string;
  physicalMemberStatus?: "pending" | "approved" | "rejected" | "terminated" | "none";
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
  mode?: string;
  status?: string;
  notes?: string;
  paymentDate?: string;
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

export interface MemberLogin {
  username: string;
  password: string;
  displayName: string;
  createdAt: any;
  mobile?: string;
  plan?: string;
  joinDate?: string;
  age?: string;
  gender?: string;
  address?: string;
  trainer?: string;
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
  memberLogins: MemberLogin[];
  joinRequests: JoinRequest[];
  globalError: string | null;
  loginWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  saveUserProfile: (weight: number, height: number, bmi: number, category: string, goal: string) => Promise<void>;
  verifyPhysicalMembership: (
    registeredName: string,
    phone: string,
    gender: string,
    age: string,
    joinDate: string,
    address: string,
    plan?: string,
    goal?: string,
    height?: number,
    weight?: number,
    bmi?: number
  ) => Promise<void>;
  updatePhysicalMemberStatus: (
    targetUserId: string, 
    status: "pending" | "approved" | "rejected" | "terminated", 
    details?: {
      cardId?: string;
      syncGoal?: string;
      paidAmount?: number;
      remainingAmount?: number;
      workoutPlan?: string;
      startDate?: string;
      endDate?: string;
      payments?: any[];
    }
  ) => Promise<void>;
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
    sessionFrequency: number,
    mode?: string,
    status?: string,
    notes?: string,
    paymentDate?: string,
    targetUserId?: string
  ) => Promise<void>;
  sendChatMessage: (text: string, sender: "user" | "bot") => Promise<void>;
  updatePlan: (plan: PricingPlan) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  addMemberLogin: (
    username: string,
    password: string,
    displayName: string,
    mobile?: string,
    plan?: string,
    joinDate?: string,
    age?: string,
    gender?: string,
    address?: string,
    trainer?: string
  ) => Promise<void>;
  editMemberLogin: (username: string, updates: Partial<MemberLogin>) => Promise<void>;
  deleteMemberLogin: (username: string) => Promise<void>;
  submitJoinRequest: (
    userName: string,
    mobile: string,
    gmail: string,
    age: string,
    planName: string
  ) => Promise<void>;
  deletePass: (passId: string) => Promise<void>;
  deleteUserProfile: (targetUserId: string) => Promise<void>;
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
  const [memberLogins, setMemberLogins] = useState<MemberLogin[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);

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
        setMemberLogins([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 1b. Fetch Plans (publicly accessible)
  useEffect(() => {
    const collectionPath = "plans";
    const q = query(collection(db, collectionPath));

    const unsubscribe = onSnapshot(
      q,
      (querySnap) => {
        const tempPlans: PricingPlan[] = [];
        querySnap.forEach((docSnap) => {
          tempPlans.push({ id: docSnap.id, ...docSnap.data() } as PricingPlan);
        });

        // If plans are empty and the logged-in user is an admin, seed the factory presets to database
        const currentUser = auth.currentUser;
        const isAdminUser = currentUser && (
          (currentUser.email || "").toLowerCase() === "gymadmin@gmail.com"
        );

        if (tempPlans.length === 0 && isAdminUser) {
          PRICING_PLANS.forEach(async (preset, idx) => {
            const planToSave = {
              id: preset.id,
              name: preset.name,
              price: preset.price,
              period: (preset.period || "month").toLowerCase(),
              isPopular: preset.popular || (preset as any).isPopular || false,
              features: preset.features,
              order: idx
            };
            try {
              await setDoc(doc(db, "plans", preset.id), planToSave);
            } catch (err) {
              console.error("Failed to seed preset plan:", preset.id, err);
            }
          });
        }

        // Sort in memory to avoid index requirements or missing order field issues
        tempPlans.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
          setUserProfile({ userId: docSnap.id, ...docSnap.data() } as UserProfile);
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
    const userEmail = (user.email || "").toLowerCase();
    const adminEmails = ["gymadmin@gmail.com", "itssabujjr@gmail.com"];
    const q = adminEmails.includes(userEmail)
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
    const userEmail = (user.email || "").toLowerCase();
    const adminEmails = ["gymadmin@gmail.com", "itssabujjr@gmail.com"];
    const q = adminEmails.includes(userEmail)
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
    if (!user) {
      setAllUserProfiles([]);
      return;
    }
    const safeEmail = (user.email || "").toLowerCase();
    const adminEmails = ["gymadmin@gmail.com", "itssabujjr@gmail.com"];
    if (!adminEmails.includes(safeEmail)) {
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
          tempProfiles.push({ userId: docSnap.id, ...docSnap.data() } as UserProfile);
        });
        setAllUserProfiles(tempProfiles);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, collectionPath);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 4c. Sync custom member logins for Admin
  useEffect(() => {
    if (!user) {
      setMemberLogins([]);
      return;
    }
    const safeEmail = (user.email || "").toLowerCase();
    const adminEmails = ["gymadmin@gmail.com", "itssabujjr@gmail.com"];
    if (!adminEmails.includes(safeEmail)) {
      setMemberLogins([]);
      return;
    }

    const collectionPath = "member_logins";
    const q = query(collection(db, collectionPath));

    const unsubscribe = onSnapshot(
      q,
      (querySnap) => {
        const temp: MemberLogin[] = [];
        querySnap.forEach((docSnap) => {
          temp.push(docSnap.data() as MemberLogin);
        });

        console.log("Fetched member logins:", temp);

        const sorted = temp.sort((a, b) => {
          const tA = a.createdAt?.seconds ? a.createdAt.seconds : (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
          const tB = b.createdAt?.seconds ? b.createdAt.seconds : (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);
          return tB - tA;
        });

        setMemberLogins([...sorted]);
      },
      (error: any) => {
        handleFirestoreError(error, OperationType.GET, collectionPath);
        setGlobalError("Failed to fetch member logins: " + error.message);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 5b. Join Requests (Admin Only)
  useEffect(() => {
    if (!user) {
      setJoinRequests([]);
      return;
    }
    const safeEmail = (user.email || "").toLowerCase();
    const adminEmails = ["gymadmin@gmail.com", "itssabujjr@gmail.com"];
    if (!adminEmails.includes(safeEmail)) {
      setJoinRequests([]);
      return;
    }

    const collectionPath = "join_requests";
    const q = query(collection(db, collectionPath), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (querySnap) => {
        const temp: JoinRequest[] = [];
        querySnap.forEach((docSnap) => {
          temp.push({ id: docSnap.id, ...docSnap.data() } as JoinRequest);
        });
        setJoinRequests(temp);
      },
      (error: any) => {
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
        displayName: user.displayName || user.email?.split("@")[0] || "Athlete",
        email: user.email || "",
        weight,
        height,
        bmi,
        category,
        goal,
        updatedAt: new Date() // Firebase rules support comparing date instances / request.time
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  };

  // Verify physical offline membership at the gym by requesting linkage
  const verifyPhysicalMembership = async (
    registeredName: string,
    phone: string,
    gender: string,
    age: string,
    joinDate: string,
    address: string,
    plan?: string,
    goal?: string,
    height?: number,
    weight?: number,
    bmi?: number
  ) => {
    if (!user) return;
    const path = `user_profiles/${user.uid}`;
    try {
      const docRef = doc(db, "user_profiles", user.uid);
      await setDoc(docRef, {
        userId: user.uid,
        displayName: user.displayName || user.email?.split("@")[0] || "Athlete",
        email: user.email || "",
        isPhysicalMemberVerified: false,
        physicalMemberStatus: "pending",
        physicalMemberName: registeredName,
        physicalMemberPhone: phone,
        physicalMemberGender: gender,
        physicalMemberAge: age,
        physicalMemberJoinDate: joinDate,
        physicalMemberAddress: address,
        physicalMemberPlan: plan || "",
        physicalMemberGoal: goal || "",
        physicalMemberHeight: height || 0,
        physicalMemberWeight: weight || 0,
        physicalMemberBmi: bmi || 0,
        physicalMemberRequestedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  };

  // Update physical offline membership status by Admin
  const updatePhysicalMemberStatus = async (
    targetUserId: string, 
    status: "pending" | "approved" | "rejected" | "terminated", 
    details?: {
      cardId?: string;
      syncGoal?: string;
      paidAmount?: number;
      remainingAmount?: number;
      workoutPlan?: string;
      startDate?: string;
      endDate?: string;
      payments?: any[];
    }
  ) => {
    const path = `user_profiles/${targetUserId}`;
    try {
      const docRef = doc(db, "user_profiles", targetUserId);
      await setDoc(docRef, {
        physicalMemberStatus: status,
        isPhysicalMemberVerified: status === "approved",
        physicalMemberCardId: details?.cardId || null,
        goal: details?.syncGoal || null,
        physicalMemberPaidAmount: details?.paidAmount !== undefined ? details.paidAmount : 0,
        physicalMemberRemainingAmount: details?.remainingAmount !== undefined ? details.remainingAmount : 0,
        physicalMemberWorkoutPlan: details?.workoutPlan || "",
        physicalMemberPlanStartDate: details?.startDate || "",
        physicalMemberPlanEndDate: details?.endDate || "",
        physicalMemberPayments: details?.payments || [],
        physicalMemberVerifiedAt: status === "approved" ? new Date().toISOString() : null,
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
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
      throw error;
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
      throw error;
    }
  };

  // Save purchased digital membership pass
  const addPass = async (
    clientName: string,
    planId: string,
    planName: string,
    payablePrice: string,
    sessionFrequency: number,
    mode?: string,
    status?: string,
    notes?: string,
    paymentDate?: string,
    targetUserId?: string
  ) => {
    if (!user) return;
    const passId = `ps_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const path = `passes/${passId}`;
    try {
      const docRef = doc(db, "passes", passId);
      await setDoc(docRef, {
        passId,
        userId: targetUserId || user.uid,
        clientName,
        planId,
        planName,
        payablePrice,
        sessionFrequency,
        createdAt: new Date(),
        mode: mode || "Cash",
        status: status || "Paid",
        notes: notes || "",
        paymentDate: paymentDate || ""
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
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
      throw error;
    }
  };

  const updatePlan = async (plan: PricingPlan) => {
    if (!user) throw new Error("You do not have permission.");
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
        throw error;
    }
  };

  const deletePlan = async (planId: string) => {
    if (!user) throw new Error("You do not have permission.");
    const path = `plans/${planId}`;
    try {
        await deleteDoc(doc(db, "plans", planId));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
        throw error;
    }
  };

  const addMemberLogin = async (
    username: string,
    password: string,
    displayName: string,
    mobile?: string,
    plan?: string,
    joinDate?: string,
    age?: string,
    gender?: string,
    address?: string,
    trainer?: string
  ) => {
    if (!user) throw new Error("You do not have permission.");
    const cleanUsername = username.toLowerCase().trim();
    const docPath = `member_logins/${cleanUsername}`;
    try {
      await setDoc(doc(db, "member_logins", cleanUsername), {
        username: cleanUsername,
        password,
        displayName,
        createdAt: new Date(),
        mobile: mobile || "89123******",
        plan: plan || "Monthly",
        joinDate: joinDate || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        age: age || "",
        gender: gender || "",
        address: address || "",
        trainer: trainer || ""
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
      throw error;
    }
  };

  const editMemberLogin = async (username: string, updates: Partial<MemberLogin>) => {
    if (!user) throw new Error("You do not have permission.");
    const cleanUsername = username.toLowerCase().trim();
    const docPath = `member_logins/${cleanUsername}`;
    try {
      const docRef = doc(db, "member_logins", cleanUsername);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await setDoc(docRef, {
          ...docSnap.data(),
          ...updates,
          createdAt: docSnap.data().createdAt || new Date()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
      throw error;
    }
  };

  const deleteMemberLogin = async (username: string) => {
    if (!user) throw new Error("You do not have permission.");
    const cleanUsername = username.toLowerCase().trim();
    const docPath = `member_logins/${cleanUsername}`;
    try {
      await deleteDoc(doc(db, "member_logins", cleanUsername));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
      throw error;
    }
  };

  const deletePass = async (passId: string) => {
    if (!user) throw new Error("You do not have permission.");
    const path = `passes/${passId}`;
    try {
      await deleteDoc(doc(db, "passes", passId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
      throw error;
    }
  };

  const submitJoinRequest = async (
    userName: string,
    mobile: string,
    gmail: string,
    age: string,
    planName: string
  ) => {
    if (!user) throw new Error("Must be logged in.");
    const requestId = `jr_${Date.now()}`;
    const path = `join_requests/${requestId}`;
    try {
      await setDoc(doc(db, "join_requests", requestId), {
        userId: user.uid,
        userName,
        mobile,
        gmail,
        age,
        planName,
        createdAt: new Date(),
        status: "pending"
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  };

  const deleteUserProfile = async (targetUserId: string) => {
    if (!user) throw new Error("You do not have permission.");
    const path = `user_profiles/${targetUserId}`;
    try {
      const docRef = doc(db, "user_profiles", targetUserId);
      await setDoc(docRef, {
        isPhysicalMemberVerified: false,
        physicalMemberStatus: "terminated",
        physicalMemberCardId: null,
        physicalMemberVerifiedAt: null,
        // We keep the requested info for history but toggle verified off
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
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
        memberLogins,
        joinRequests,
        globalError,
        loginWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logout,
        saveUserProfile,
        verifyPhysicalMembership,
        updatePhysicalMemberStatus,
        addBooking,
        cancelBooking,
        addPass,
        sendChatMessage,
        updatePlan,
        deletePlan,
        addMemberLogin,
        editMemberLogin,
        deleteMemberLogin,
        submitJoinRequest,
        deletePass,
        deleteUserProfile
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
