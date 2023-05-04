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

const PROTECTED_ROUTES = ["/venues/add", "/profile"];

export const AuthProvider: FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null | undefined>(undefined);
  const router = useRouter();

  const login = useCallback(async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      user.getIdTokenResult().then(async (idTokenResult) => {
        console.log(idTokenResult.claims);
        if (idTokenResult.claims.email_verified) {
          console.log("verified");
        } else {
          try {
            console.log("gonna try to logout");
            await signOut(auth);
          } catch (e) {
            console.error("Error signing out", e);
          }
        }
      });
    } catch (error) {
      console.error("Error signing in with password and email", error);
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

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      if (user !== undefined) {
        if (PROTECTED_ROUTES.includes(router.pathname) && !user) {
          router.push("/auth");
        } else {
          setIsLoading(false);
        }
      }
    };

    const activateLoader = () => setIsLoading(true);

    checkAuth();

    router.events.on("routeChangeStart", activateLoader);
    router.events.on("routeChangeComplete", checkAuth);

    return () => {
      router.events.off("routeChangeStart", activateLoader);
      router.events.off("routeChangeComplete", checkAuth);
    };
  }, [router, user]);

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
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
