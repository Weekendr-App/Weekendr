import { auth } from "@diplomski/utils/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "@firebase/auth";
import {
  createContext,
  useState,
  ReactNode,
  FC,
  useCallback,
  useContext,
  useEffect,
} from "react";

interface FirebaseUser {
  email: string;
  id: string;
  token: string;
}

interface Props {
  children: ReactNode;
}

interface AuthContextProps {
  user: FirebaseUser | null;
  authenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  authenticated: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const AuthProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in with password and email", error);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Error signing up with password and email", error);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user || !user.email) {
        setUser(null);
      } else {
        const token = await user.getIdToken();
        setUser({
          email: user.email,
          id: user.uid,
          token,
        });
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
