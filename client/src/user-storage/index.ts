import { User } from '../../../shared/types';

const USER_LOCALSTORAGE_KEY = 'lazyday_user';

// helper to get user from localstorage
export function getStoredUser(): User | null {
  const storedUserJSON = localStorage.getItem(USER_LOCALSTORAGE_KEY);

  let storedUser = null;

  if (storedUserJSON) {
    try {
      storedUser = JSON.parse(storedUserJSON);
    } catch (error) {
      // ok, returns null
    }
  }

  return storedUser;
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(USER_LOCALSTORAGE_KEY);
}
