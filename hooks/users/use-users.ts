"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "@/api/users/users.api";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserItem,
} from "@/types/users/user.type";
import { withProcessToast } from "@/lib/feedback/process-toast";

export function useUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const usersResponse = await fetchUsers();
      setUsers(usersResponse);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible cargar los usuarios.";

      toast.error("No se pudieron cargar los usuarios", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleCreateUser = useCallback(async (payload: CreateUserPayload) => {
    try {
      setIsMutating(true);

      return await withProcessToast(
        async () => {
          const createdUser = await createUser(payload);
          setUsers((currentUsers) => [createdUser, ...currentUsers]);
          return createdUser;
        },
        {
          loading: "Creando usuario...",
          success: "Usuario creado correctamente",
          successDescription: (user) =>
            `Se registró el acceso de ${user.full_name}.`,
          error: "No se pudo crear el usuario",
        },
      );
    } finally {
      setIsMutating(false);
    }
  }, []);

  const handleUpdateUser = useCallback(
    async (userId: string, payload: UpdateUserPayload) => {
      try {
        setIsMutating(true);

        return await withProcessToast(
          async () => {
            const updatedUser = await updateUser(userId, payload);
            setUsers((currentUsers) =>
              currentUsers.map((user) =>
                user.id === userId ? updatedUser : user,
              ),
            );
            return updatedUser;
          },
          {
            loading: "Actualizando usuario...",
            success: "Usuario actualizado correctamente",
            successDescription: (user) =>
              `Los datos de ${user.full_name} fueron guardados.`,
            error: "No se pudo actualizar el usuario",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [],
  );

  const handleDeleteUser = useCallback(async (user: UserItem) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Desactivar usuario?",
      text: `Se desactivará ${user.full_name}. Esta acción puede revertirse editando su estado.`,
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsMutating(true);

      await withProcessToast(
        async () => {
          const deletedUser = await deleteUser(user.id);
          setUsers((currentUsers) =>
            currentUsers.map((currentUser) =>
              currentUser.id === user.id ? deletedUser : currentUser,
            ),
          );
          return deletedUser;
        },
        {
          loading: "Desactivando usuario...",
          success: "Usuario desactivado correctamente",
          successDescription: (deletedUser) =>
            `${deletedUser.full_name} ya no tiene acceso activo.`,
          error: "No se pudo desactivar el usuario",
        },
      );
    } finally {
      setIsMutating(false);
    }
  }, []);

  const activeUsersCount = useMemo(() => {
    return users.filter((user) => user.is_active).length;
  }, [users]);

  return {
    users,
    isLoading,
    isMutating,
    activeUsersCount,
    loadUsers,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
  };
}
