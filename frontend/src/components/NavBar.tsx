import { Link } from "react-router";

export const NavBar = () => (
  <nav className="navbar navbar-light bg-light">
    <div className="container-fluid justify-content-start">
      <Link className="navbar-brand" to="/">
        Napravi Uplatnicu
      </Link>
      <ul className="nav align-self-start d-flex">
        <li className="nav-item">
          <Link
            to={"/history"}
            className="btn btn-link nav-link text-decoration-underline"
          >
            Istorija uplatnica
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/receivers"
            className="btn btn-link nav-link text-decoration-underline"
          >
            Primaoci plačanja
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/profile"
            className="btn btn-link nav-link text-decoration-underline"
          >
            Moj profil
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);
