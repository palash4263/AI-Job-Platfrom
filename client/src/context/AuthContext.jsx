import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(
        JSON.parse(storedUser)
      );
    }

  }, []);

  // LOGIN
  const login = (
    email,
    password
  ) => {

    const users =
      JSON.parse(
        localStorage.getItem(
          "users"
        )
      ) || [];

    const existingUser =
      users.find(
        (u) =>
          u.email === email &&
          u.password === password
      );

    if (!existingUser) {
      return {
        success: false,
        message:
          "Invalid email or password",
      };
    }

    localStorage.setItem(
      "user",
      JSON.stringify(existingUser)
    );

    setUser(existingUser);

    return {
      success: true,
    };
  };

  // SIGNUP
  const signup = (
    name,
    email,
    password
  ) => {

    const users =
      JSON.parse(
        localStorage.getItem(
          "users"
        )
      ) || [];

    const userExists =
      users.find(
        (u) => u.email === email
      );

    if (userExists) {
      return {
        success: false,
        message:
          "User already exists",
      };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
    };

    users.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    localStorage.setItem(
      "user",
      JSON.stringify(newUser)
    );

    setUser(newUser);

    return {
      success: true,
    };
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem(
      "user"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);