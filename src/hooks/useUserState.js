import { useEffect, useState } from "react";
import { useAuth } from "reactfire";

function useUserState() {
  const auth = useAuth();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      console.log(JSON.stringify({ name: authUser?.displayName }));
      setUser(authUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  return {
    user,
    loading,
    signedIn: Boolean(user),
  };
}

export default useUserState;
