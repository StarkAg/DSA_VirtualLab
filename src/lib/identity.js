// Client identity: the signed-in user's profile (incl. Convex userId + role),
// cached in localStorage. Progress itself lives in Convex (see lib/stats.js).
const PROFILE_KEY = 'dsalab.profile';

export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
}

// Admin session (passcode) is kept in sessionStorage so it clears on tab close.
const ADMIN_KEY = 'dsalab.admin';
export const getAdminPasscode = () => sessionStorage.getItem(ADMIN_KEY) || '';
export const setAdminPasscode = (p) => sessionStorage.setItem(ADMIN_KEY, p);
export const clearAdminPasscode = () => sessionStorage.removeItem(ADMIN_KEY);
