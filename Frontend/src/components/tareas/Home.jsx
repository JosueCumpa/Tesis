import MySidebar from "./MySidebar";
import Tareas from "./Tareas";
import toast, { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router";

export default function Home() {
  return (
    <div className="flex">
      <MySidebar />
      <div className="p-5 w-full flex-1 max-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="tareas" />} />
          <Route path="tareas" element={<Tareas />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}
