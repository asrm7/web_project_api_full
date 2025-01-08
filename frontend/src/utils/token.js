const TOKEN_KEY = "user-token";

export const setToken = (token) => {
  return localStorage.setItem(TOKEN_KEY, token);
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
 return localStorage.removeItem(TOKEN_KEY);
};