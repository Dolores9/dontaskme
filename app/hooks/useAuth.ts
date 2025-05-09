// hooks/useAuth.ts
import { getAuth } from 'firebase/auth';

export default function useCurrentUserId(): string | null {
  const user = getAuth().currentUser;
  return user ? user.uid : null;
  
}