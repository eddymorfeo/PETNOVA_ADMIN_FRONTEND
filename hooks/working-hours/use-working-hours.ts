"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createWorkingHour,
  deleteWorkingHour,
  fetchWorkingHours,
  fetchWorkingHourVeterinarians,
  updateWorkingHour,
} from "@/api/working-hours/working-hours.api";
import type {
  UpsertWorkingHoursPayload,
  VeterinarianOption,
  WorkingHourItem,
} from "@/types/working-hours/working-hour.type";
import {
  buildCreateWorkingHourPayloads,
  buildWorkingHourStats,
} from "@/utils/working-hours/working-hour-mappers";
import { withProcessToast } from "@/lib/feedback/process-toast";

export function useWorkingHours() {
  const [workingHours, setWorkingHours] = useState<WorkingHourItem[]>([]);
  const [veterinarians, setVeterinarians] = useState<VeterinarianOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadWorkingHourData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [workingHoursResponse, veterinariansResponse] = await Promise.all([
        fetchWorkingHours(),
        fetchWorkingHourVeterinarians(),
      ]);

      setWorkingHours(workingHoursResponse);
      setVeterinarians(veterinariansResponse.filter((item) => item.is_active));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWorkingHourData();
  }, [loadWorkingHourData]);

  const handleCreateWorkingHours = useCallback(
    async (payload: UpsertWorkingHoursPayload) => {
      setIsMutating(true);

      try {
        await withProcessToast(
          async () => {
            const createPayloads = buildCreateWorkingHourPayloads(payload);

            for (const createPayload of createPayloads) {
              await createWorkingHour(createPayload);
            }

            await loadWorkingHourData();
            return createPayloads.length;
          },
          {
            loading: "Creando horario...",
            success: (count) =>
              count === 1
                ? "Horario creado correctamente"
                : "Horarios creados correctamente",
            successDescription: (count) =>
              count === 1
                ? "Se registró el horario seleccionado."
                : `Se registraron ${count} horarios seleccionados.`,
            error: "No se pudo crear el horario",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [loadWorkingHourData],
  );

  const handleUpdateWorkingHours = useCallback(
    async (
      currentWorkingHour: WorkingHourItem,
      payload: UpsertWorkingHoursPayload,
    ) => {
      setIsMutating(true);

      try {
        await withProcessToast(
          async () => {
            const selectedWeekdays = [...payload.weekdays];
            const firstWeekday = selectedWeekdays[0];
            const additionalWeekdays = selectedWeekdays.slice(1);

            await updateWorkingHour(currentWorkingHour.id, {
              veterinarianId: payload.veterinarianId,
              weekday: firstWeekday,
              startTime: payload.startTime,
              endTime: payload.endTime,
              slotMinutes: payload.slotMinutes,
              isActive: payload.isActive,
            });

            for (const weekday of additionalWeekdays) {
              const alreadyExists = workingHours.some(
                (item) =>
                  item.id !== currentWorkingHour.id &&
                  item.veterinarian_id === payload.veterinarianId &&
                  item.weekday === weekday &&
                  normalizeTime(item.start_time) === payload.startTime &&
                  normalizeTime(item.end_time) === payload.endTime,
              );

              if (alreadyExists) {
                continue;
              }

              await createWorkingHour({
                veterinarianId: payload.veterinarianId,
                weekday,
                startTime: payload.startTime,
                endTime: payload.endTime,
                slotMinutes: payload.slotMinutes,
              });
            }

            await loadWorkingHourData();
          },
          {
            loading: "Actualizando horario...",
            success: "Horario actualizado correctamente",
            successDescription: "Los cambios del horario fueron guardados.",
            error: "No se pudo actualizar el horario",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [loadWorkingHourData, workingHours],
  );

  const handleDeleteWorkingHour = useCallback(
    async (workingHour: WorkingHourItem) => {
      setIsMutating(true);

      try {
        await withProcessToast(
          async () => {
            await deleteWorkingHour(workingHour.id);
            await loadWorkingHourData();
          },
          {
            loading: "Eliminando horario...",
            success: "Horario eliminado correctamente",
            successDescription: "El horario ya no estará disponible.",
            error: "No se pudo eliminar el horario",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [loadWorkingHourData],
  );

  const { totalSchedules, activeSchedules } = useMemo(
    () => buildWorkingHourStats(workingHours),
    [workingHours],
  );

  return {
    workingHours,
    veterinarians,
    isLoading,
    isMutating,
    totalSchedules,
    activeSchedules,
    handleCreateWorkingHours,
    handleUpdateWorkingHours,
    handleDeleteWorkingHour,
  };
}

function normalizeTime(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  return value.slice(0, 5);
}
