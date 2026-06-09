import { NavBar } from "./NavBar.tsx";
import type { PropsWithChildren } from "react";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};
