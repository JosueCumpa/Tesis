import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Eliminar_tarea({ tarea, type = "eliminar", refetch }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDelete = async (id, onClose) => {
    console.log(id);
    const url = `http://127.0.0.1:8000/api/v1/tarea/${tarea.id}/`;

    await axios.delete(url);
    refetch();
    onClose();
    toast.success("Tarea eliminada exitosamente");
  };

  const handleOpen = (onOpen) => {
    onOpen();
  };

  return (
    <>
      {type === "add" ? (
        <Tooltip content="Agregar tarea">
          <Button
            className="bg-transparent"
            startContent={<TrashIcon className="w-6 -m-1 text-default-750" />}
            size="sm"
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
            <TrashIcon className="w-6 text-default-500" />
          </Button>
        </Tooltip>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Eliminar
              </ModalHeader>
              <ModalBody>
                <p>Estas seguro de eliminar la tarea: {tarea.nombre}?</p>
              </ModalBody>
              <ModalFooter>
                <Button olor="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="success"
                  onPress={() => handleDelete(tarea.id, onClose)}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
        <Toaster />
      </Modal>
    </>
  );
}
