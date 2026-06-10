import { Spinner } from "react-bootstrap";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ fullScreen = false }: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Učitavanje...</span>
        </Spinner>
      </div>
    );
  }
  return (
    <div className="d-flex justify-content-center my-4">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Učitavanje...</span>
      </Spinner>
    </div>
  );
};
