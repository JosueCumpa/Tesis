import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Card, CardBody, Image, Input } from "@nextui-org/react";
import Logo from "../../assets/logito.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../../App";

function Login() {
  const { loginThunk } = useContext(AuthContext);

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    // Aquí puedes realizar la lógica de envío de datos a tu vista de Django
    const { username, password } = formData;

    // Realiza una solicitud POST a la vista de inicio de sesión de Django
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 200) {
      // El inicio de sesión fue exitoso, puedes redirigir al usuario a una página de inicio, por ejemplo.

      loginThunk(formData.username, formData.password).then(() => {
        navigate("/home");
        toast.success("Tarea agregada exitosamente");

        console.log("inicio sesion correctamente");
      });
    } else {
      // El inicio de sesión falló, puedes manejar errores aquí
      const data = await response.json();
      console.log("Error de inicio de sesión:", data.message);
      toast.error("Error de inicio de sesión");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
        shadow="sm"
      >
        <CardBody>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
            <div className="relative col-span-6 md:col-span-4 ">
              <Image
                alt="logo"
                className="Logo-Abraham"
                height={500}
                shadow="lg"
                src={Logo}
                width="100%"
              />
            </div>

            <div className="flex flex-col col-span-6 md:col-span-8 text-center">
              <div className="flex flex-col gap-2 ">
                <form onSubmit={handleLoginSubmit}>
                  <div>
                    <h1 className="text-large font-medium mt-2 text-center">
                      INICIO DE SESION
                    </h1>
                    <br />
                    <Input
                      type="text"
                      id="username"
                      variant="bordered"
                      label="Usuario"
                      name="username"
                      placeholder="Ingrese usuario"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <br></br>
                  <div>
                    <Input
                      type={isVisible ? "text" : "password"}
                      label="Contraseña"
                      variant="bordered"
                      id="password"
                      name="password"
                      placeholder="Ingrese su contraseña"
                      value={formData.password}
                      onChange={handleInputChange}
                      endContent={
                        <button
                          className="focus:outline-none "
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? (
                            <EyeSlashIcon className="text-4xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeIcon className="text-4xl text-default-400 pointer-events-none" />
                          )}
                          ***
                        </button>
                      }
                    />
                  </div>
                  <br />
                  <button
                    type="submit"
                    className="w-full bg-primary text-white text-lg py-2 rounded-lg"
                  >
                    Iniciar Sesión
                  </button>
                  <Toaster />
                </form>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;
