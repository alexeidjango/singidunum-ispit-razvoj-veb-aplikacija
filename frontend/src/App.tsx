import "./App.css";
import { Layout } from "./components/Layout.tsx";
import { Route, Routes } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/">
          <Route index element={<>main</>} />
          <Route path="profile" element={<>profile</>} />
          <Route path="history" element={<>history list</>} />
          <Route path="history/:id" element={<>history view/edie</>} />
          <Route path="receivers" element={<>receivers list</>} />
          <Route path="receiver/:id" element={<>receiver view/edit</>} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
