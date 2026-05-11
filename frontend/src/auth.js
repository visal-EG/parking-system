import { api } from './api';

export function getUser() {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}

export function setSession(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({
    username: data.username, role: data.role, userId: data.userId,
  }));
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function login(username, password) {
  const { data } = await api.post('/api/auth/login', { username, password });
  setSession(data);
  return data;
}

export async function register(username, password, email) {
  const { data } = await api.post('/api/auth/register', { username, password, email });
  setSession(data);
  return data;
}

export function hasRole(...roles) {
  const u = getUser();
  return u && roles.includes(u.role);
}
