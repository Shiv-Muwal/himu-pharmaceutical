import { BrowserRouter } from "react-router-dom";
import AdminPage from "@/admin";
import { AdminPreloader } from "@/admin/components/AdminPreloader";

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <AdminPreloader />
      <AdminPage />
    </BrowserRouter>
  );
}
