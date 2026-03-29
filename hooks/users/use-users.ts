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

      const createdUser = await createUser(payload);

      setUsers((currentUsers) => [createdUser, ...currentUsers]);

      toast.success("Usuario creado correctamente", {
        description: `Se registró el usuario ${createdUser.full_name}.`,
      });

      return createdUser;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible crear el usuario.";

      await Swal.fire({
        icon: "error",
        title: "No se pudo crear el usuario",
        text: message,
        confirmButtonColor: "#4f46e5",
      });

      throw error;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const handleUpdateUser = useCallback(
    async (userId: string, payload: UpdateUserPayload) => {
      try {
        setIsMutating(true);

        const updatedUser = await updateUser(userId, payload);

        setUsers((currentUsers) =>
          currentUsers.map((user) => (user.id === userId ? updatedUser : user)),
        );

        toast.success("Usuario actualizado", {
          description: `Se actualizó ${updatedUser.full_name}.`,
        });

        return updatedUser;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No fue posible actualizar el usuario.";

        await Swal.fire({
          icon: "error",
          title: "No se pudo actualizar el usuario",
          text: message,
          confirmButtonColor: "#4f46e5",
        });

        throw error;
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

      const deletedUser = await deleteUser(user.id);

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id ? deletedUser : currentUser,
        ),
      );

      toast.success("Usuario desactivado", {
        description: `${deletedUser.full_name} fue desactivado correctamente.`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible desactivar el usuario.";

      await Swal.fire({
        icon: "error",
        title: "No se pudo desactivar el usuario",
        text: message,
        confirmButtonColor: "#4f46e5",
      });
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