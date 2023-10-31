import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { PropTypes } from "prop-types";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Editar_tarea({ tarea, type = "edit", refetch }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [nombre, setnombre] = useState("");
  const [estado, setestado] = useState(false);
  const [error, setError] = useState(false);

  const validateName = (nombre) => {
    if (nombre.length > 0) {
      return true;
    }
    return false;
  };

  const handleNameChange = (e) => {
    let nombre = e.target.value;

    if (nombre.length > 25) {
      nombre = nombre.substring(0, 25);
    }

    setnombre(nombre);
  };

  const handleClose = (onClose) => {
    setestado(false);
    setnombre("");
    onClose();
  };

  const handleOpen = (onOpen) => {
    if (type === "edit") {
      setestado(tarea.estado);
      setnombre(tarea.nombre);
    }
    onOpen();
  };

  const handleSubmit = async (onClose) => {
    validateName(nombre) ? setError(false) : setError(true);

    if (!error) {
      if (type === "edit") {
        const url = `http://127.0.0.1:8000/api/v1/tarea/${tarea?.id}/`;

        const data = {
          id: tarea.id,
          nombre: nombre,
          estado: estado,
        };

        await toast.promise(axios.put(url, data), {
          loading: "Actualizando...",
          success: "Tarea actualizada",
          error: "Error al actualizar Tarea",
        });
      } else {
        const url = `http://localhost:8000/api/v1/tarea/`;

        const data = {
          nombre: nombre,
          estado: estado,
        };

        await toast.promise(axios.post(url, data), {
          loading: "Registrando...",
          success: "tarea registrada",
          error: (err) => `Error al registrar area: ${err.toString()}`,
        });
      }
      onClose();
      refetch();
    }
  };

  return (
    <>
      {type === "add" ? (
        <Tooltip content="Agregar tarea">
          <Button
            className="bg-transparent"
            startContent={
              <PlusCircleIcon className="w-6 -m-1 text-default-750" />
            }
            size="sm"
            onPress={() => handleOpen(onOpen)}
          >
            Agregar
          </Button>
        </Tooltip>
      ) : (
        <Tooltip content="Editar tarea">
          <Button
            isIconOnly
            className="bg-transparent"
            onPress={() => handleOpen(onOpen)}
          >
            <PencilSquareIcon className="w-6 text-default-500" />
          </Button>
        </Tooltip>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {type === "add" ? "Agregar tarea" : "Editar tarea"}
              </ModalHeader>
              <ModalBody>
                <div className="flex relative flex-col gap-4">
                  <Input
                    label="Nombre"
                    isInvalid={error}
                    errorMessage={error && "Ingrese la tarea correctamente"}
                    value={nombre}
                    onChange={(e) => handleNameChange(e)}
                  ></Input>
                  <Switch defaultSelected={estado} onValueChange={setestado}>
                    Activo
                  </Switch>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={() => handleClose(onClose)}
                >
                  Cancelar
                </Button>

                <Button color="success" onClick={() => handleSubmit(onClose)}>
                  Guardar
                </Button>
                <Toaster />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
Editar_tarea.propTypes = {
  tarea: PropTypes.object,
  type: PropTypes.string.isRequired,
};
