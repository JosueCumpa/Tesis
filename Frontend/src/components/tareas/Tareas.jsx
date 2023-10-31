import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  CardHeader,
  Card,
  Chip,
  Image,
} from "@nextui-org/react";
import useSWR, { useSWRConfig } from "swr";
import Editar_tarea from "./Editar_tarea";
import Eliminar_tarea from "./Eliminar_tarea";
import Agregar_tarea from "./Agregar_tarea";

const statusColorMap = {
  true: "success",
  false: "danger",
  vacation: "warning",
};

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Tareas() {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [agregar, setAgregar] = React.useState(true);
  const [conteos, setConteos] = useState(null);

  const { data, error } = useSWR(
    `http://127.0.0.1:8000/api/v1/tarea/?limit=${rowsPerPage}&offset=${
      (page - 1) * rowsPerPage
    }`,
    fetcher
  );
  const { mutate } = useSWRConfig();

  const loadingState = !data && !error ? "loading" : "idle";

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const refetch = () => {
    mutate(
      `http://127.0.0.1:8000/api/v1/tarea/?limit=${rowsPerPage}&offset=${
        (page - 1) * rowsPerPage
      }`
    );
  };

  const totalPages = Math.ceil(data?.count / rowsPerPage) || 0;

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:8000/api/v1/tarea/conteos")
        .then((response) => response.json())
        .then((data) => {
          setConteos(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, 1000); // Realizar la solicitud cada 2 segundos

    return () => {
      clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
    };
  }, []);

  return (
    <div>
      <div className="flex relative justify-center gap-5">
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://www.seekpng.com/png/full/694-6945539_registro-png.png"
              width={40}
            />
            <div className="flex flex-col ">
              <p className="text-md">Total registros:</p>
              <p className="text-md ">
                {conteos !== null ? (
                  <p className="text-center"> {conteos.count}</p>
                ) : (
                  <p>Cargando...</p>
                )}
              </p>
            </div>
          </CardHeader>
        </Card>
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://static.vecteezy.com/system/resources/previews/017/178/234/original/check-mark-symbol-icon-on-transparent-background-free-png.png"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">Total activos:</p>
              <p className="text-md">
                {conteos !== null ? (
                  <p className="text-center">{conteos.conteo_activos}</p>
                ) : (
                  <p>Cargando...</p>
                )}
              </p>
            </div>
          </CardHeader>
        </Card>

        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://p9n2c8y2.rocketcdn.me/wp-content/uploads/2021/05/5.png.webp"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">Total inactivos:</p>
              <p className="text-md">
                {conteos !== null ? (
                  <p className="text-center">{conteos.conteo_inactivos}</p>
                ) : (
                  <p>Cargando...</p>
                )}
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>
      <br />

      <Card>
        <CardHeader className="flex gap-3 justify-center font-bold text-large">
          <span>Tabla Tareas</span>
          {agregar && (
            <Agregar_tarea
              onClose={() => setAgregar(false)}
              refetch={refetch}
            />
          )}
        </CardHeader>

        <Table
          aria-label="paginacion de tabla"
          bottomContent={
            totalPages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[5, 10, 20]}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn key="nombre">Nombre</TableColumn>
            <TableColumn key="estado">Estado</TableColumn>
            <TableColumn key="acciones">Acciones</TableColumn>
          </TableHeader>
          <TableBody
            items={data?.results ?? []}
            loadingContent={<Spinner />}
            loadingState={loadingState}
          >
            {(item) => (
              <TableRow key={item?.name}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={statusColorMap[item.estado]}
                    size="sm"
                    variant="flat"
                  >
                    {item.estado ? "Activo" : "Inactivo"}
                  </Chip>
                </TableCell>
                <TableCell className="flex relative">
                  <Editar_tarea tarea={item} refetch={refetch}></Editar_tarea>
                  <Eliminar_tarea
                    tarea={item}
                    refetch={refetch}
                  ></Eliminar_tarea>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
