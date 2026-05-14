"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createTimeOff,
  deleteTimeOff,
  fetchTimeOff,
  fetchTimeOffVeterinarians,
  updateTimeOff,
} from "@/api/time-off/time-off.api";
import type {
  CreateTimeOffPayload,
  TimeOffItem,
  UpdateTimeOffPayload,
  VeterinarianOption,
} from "@/types/time-off/time-off.type";
import { buildTimeOffStats } from "@/utils/time-off/time-off-mappers";
import { withProcessToast } from "@/lib/feedback/process-toast";

export function useTimeOff() {
  const [timeOffBlocks, setTimeOffBlocks] = useState<TimeOffItem[]>([]);
  const [veterinarians, setVeterinarians] = useState<VeterinarianOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadTimeOffData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [timeOffResponse, veterinariansResponse] = await Promise.all([
        fetchTimeOff(),
        fetchTimeOffVeterinarians(),
      ]);

      setTimeOffBlocks(timeOffResponse);
      setVeterinarians(veterinariansResponse.filter((item) => item.is_active));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTimeOffData();
  }, [loadTimeOffData]);

  const handleCreateTimeOff = useCallback(
    async (payload: CreateTimeOffPayload) => {
      setIsMutating(true);

      try {
        await withProcessToast(
          async () => {
            await createTimeOff(payload);
            await loadTimeOffData();
          },
          {
            loading: "Creando bloqueo...",
            success: "Bloqueo creado correctamente",
            successDescription: "El horario quedó marcado como no disponible.",
            error: "No se pudo crear el bloqueo",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [loadTimeOffData],
  );

  const handleUpdateTimeOff = useCallback(
    async (timeOffId: string, payload: UpdateTimeOffPayload) => {
      setIsMutating(true);

      try {
        await withProcessToast(
          async () => {
            await updateTimeOff(timeOffId, payload);
            await loadTimeOffData();
          },
          {
            loading: "Actualizando bloqueo...",
            success: "Bloqueo actualizado correctamente",
            successDescription: "Los cambios del bloqueo fueron guardados.",
            error: "No se pudo actualizar el bloqueo",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [loadTimeOffData],
  );

  const handleDeleteTimeOff = useCallback(
    async (timeOffItem: TimeOffItem) => {
      setIsMutating(true);

      try {
        await withProcessToast(
          async () => {
            await deleteTimeOff(timeOffItem.id);
            await loadTimeOffData();
          },
          {
            loading: "Eliminando bloqueo...",
            success: "Bloqueo eliminado correctamente",
            successDescription: "El horario vuelve a estar disponible.",
            error: "No se pudo eliminar el bloqueo",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [loadTimeOffData],
  );

  const { totalBlocks, totalVeterinariansWithBlocks } = useMemo(
    () => buildTimeOffStats(timeOffBlocks),
    [timeOffBlocks],
  );

  return {
    timeOffBlocks,
    veterinarians,
    isLoading,
    isMutating,
    totalBlocks,
    totalVeterinariansWithBlocks,
    handleCreateTimeOff,
    handleUpdateTimeOff,
    handleDeleteTimeOff,
  };
}
