import { useEffect, useState, createContext, ReactNode } from "react";
import { api } from "../services/api";

type AuthData = {
  signOut: () => void;
  signinUrl: string;
  user: User | null;
};

type AuthProviderProps = {
  children: ReactNode;
};

type AuthResponse = {
  token: string;
  user: User;
};

type User = {
  name: string;
  avatar_url: string;
  id: string;
  login: string;
};

export const authContext = createContext({} as AuthData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const signinUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=94db1994ed4e770f2bdf`;

  const [user, setUser] = useState<User | null>(null);

  const signin = async (githubCode: string) => {
    const { data } = await api.post<AuthResponse>("authenticate", {
      code: githubCode,
    });
    const { token, user } = data;
    api.defaults.headers.common.authorization = `Bearer ${token}`;
    localStorage.setItem("@dowhile:token", token);
    setUser(user);
  };

  const validationToken = async () => {
    const token = localStorage.getItem("@dowhile:token");

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;
      const { data } = await api.get<User>("profile");
      setUser(data);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("@dowhile:token");
  };

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes("?code=");

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split("?code=");

      window.history.pushState({}, "", urlWithoutCode);

      signin(githubCode);
    }
  }, []);

  useEffect(() => {
    validationToken();
  }, []);

  return (
    <authContext.Provider
      value={{
        signinUrl,
        user,
        signOut,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
