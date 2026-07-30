import { BrowserRouter } from "react-router-dom";
import AdminPage from "@/admin";

export default function App() {
  return (
    <BrowserRouter>
      <AdminPage />
    </BrowserRouter>
  );
}
