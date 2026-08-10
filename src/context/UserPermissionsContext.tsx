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
  const isReadOnly = false;

  return (
    <UserPermissionsContext.Provider value={{ isReadOnly }}>
      {children}
    </UserPermissionsContext.Provider>
  );
};
