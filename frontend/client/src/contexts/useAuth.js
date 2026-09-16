import { useEffect } from "react";
import { useState } from "react";
import { authenticateUser } from "../services/api";

export function useAuth() {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = async () => {
          setLoading(true);
          try {
            const authenticatedUser = await authenticateUser();
    
            console.log(authenticatedUser);
    
            if (authenticatedUser?.id) setUser(authenticatedUser);
            else setUser(null);
          } catch (err) {console.log(err)};
          setLoading(false);
        };
    
        auth();
      }, []);

    return { user, setUser, loading };
}