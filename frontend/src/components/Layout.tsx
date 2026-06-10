import { Outlet } from "react-router";
import { Container } from "react-bootstrap";
import { NavBar } from "./NavBar";

export const Layout = () => {
  return (
    <>
      <NavBar />
      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  );
};
