import { HomeIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import Logo from "../../assets/logito.png";

export default function MySidebar() {
  const [collapse, setCollapse] = useState(window.innerWidth < 720);

  useEffect(() => {
    const handleResize = () => {
      setCollapse(window.innerWidth < 720);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Sidebar
      collapsed={collapse}
      className="min-h-screen"
      style={{ backgroundColor: "blue", color: "black" }}
    >
      <Menu>
        <div className="flex items-center gap-2 p-5">
          <img src={Logo} alt="sidebar react logo" />
        </div>

        <MenuItem
          component={<Link to={`/Dashboard`} />}
          icon={<HomeIcon className="h-6 w-6" />}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          component={<Link to={`/home/tareas`} />}
          icon={<HomeIcon className="h-6 w-6" />}
        >
          Tareas
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
