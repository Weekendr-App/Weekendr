import { Spinner } from "@diplomski/components/Spinner";
import { auth } from "@diplomski/utils/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "@firebase/auth";
import { useRouter } from "next/router";
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

const PROTECTED_ROUTES = ["/venues/add"];

export const AuthProvider: FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();

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

  const checkUrl = useCallback(() => {
    setIsLoading(true);
    if (PROTECTED_ROUTES.includes(router.pathname) && !user) {
      router.push("/auth");
    } else {
      setIsLoading(false);
    }
  }, [router.pathname, user]);

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

  useEffect(() => {
    checkUrl();
  }, [user]);

  useEffect(() => {
    router.events.on("routeChangeComplete", checkUrl);

    return () => {
      router.events.off("routeChangeComplete", checkUrl);
    };
  }, [router, checkUrl]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated: !!user,
        login,
        logout,
      }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
