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
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export default function Agregar_tarea({ type = "agregar", refetch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState(false);
  const [error, setError] = useState(false);

  const validateNombre = (nombre) => {
    if (nombre.length > 0) {
      return true;
    }
    return false;
  };

  const handleNombreChange = (e) => {
    let nombre = e.target.value;

    if (nombre.length > 25) {
      nombre = nombre.substring(0, 25);
    }

    setNombre(nombre);
  };

  const handlelimpiar = (onClose) => {
    setEstado(false);
    setNombre("");
    onClose();
  };

  const handleSubmit = async () => {
    validateNombre(nombre) ? setError(false) : setError(true);

    if (!error) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/v1/tarea/`,
          {
            nombre,
            estado,
          }
        );

        if (response.status === 201) {
          toast.success("Tarea agregada exitosamente");
          refetch();
        } else {
          toast.error("Error al agregar la tarea");
        }
      } catch (error) {
        toast.error("Error al comunicarse con la API");
      }
    } else {
      toast.error("Error al agregar la tarea");
    }

    onClose();
    handlelimpiar();
  };

  return (
    <>
      {type === "agregar" ? (
        <Tooltip content="Agregar tarea">
          <Button
            className="bg-transparent"
            startContent={
              <PlusCircleIcon className="w-6 -m-1 text-default-750" />
            }
            size="sm"
            onPress={onOpen}
            ml="auto"
          >
            Agregar
          </Button>
        </Tooltip>
      ) : (
        <Tooltip content="agregar tarea"></Tooltip>
      )}

      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          <ModalHeader>Agregar tarea</ModalHeader>
          <ModalBody>
            <div className="flex relative flex-col gap-5">
              <Input
                label="Nombre"
                isInvalid={error}
                errorMessage={error && "Ingrese la tarea correctamente"}
                value={nombre}
                onChange={handleNombreChange}
              />
              <Switch checked={estado} onChange={() => setEstado(!estado)}>
                Activo
              </Switch>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onClick={onClose}>
              Cancelar
            </Button>
            <Button color="success" onClick={handleSubmit}>
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
        <Toaster />
      </Modal>
    </>
  );
}
