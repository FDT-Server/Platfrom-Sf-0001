"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface UserPermissions {
  isReadOnly: boolean;
}

const UserPermissionsContext = createContext<UserPermissions>({
  isReadOnly: false,
});

export const useUserPermissions = () => useContext(UserPermissionsContext);

interface UserPermissionsProviderProps {
  children: ReactNode;
  email: string;
}

export const UserPermissionsProvider: React.FC<UserPermissionsProviderProps> = ({ children, email }) => {
  // Only jaswanth@gmail.com has write access to the platform.
  const isReadOnly = email.trim().toLowerCase() !== "jaswanth@gmail.com";

  return (
    <UserPermissionsContext.Provider value={{ isReadOnly }}>
      {children}
    </UserPermissionsContext.Provider>
  );
};
