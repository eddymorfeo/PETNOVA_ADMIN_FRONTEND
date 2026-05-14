"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";

import {
  createConsultation,
  deleteConsultation,
  fetchConsultations,
  updateConsultation,
} from "@/api/medical-records/medical-records.api";
import { fetchAppointments } from "@/api/appointments/appointments.api";
import { fetchVeterinarians } from "@/api/appointments/appointments.api";
import { fetchClients } from "@/api/clients/clients.api";
import { fetchPets } from "@/api/pets/pets.api";

import type {
  AppointmentItem,
  VeterinarianOption,
} from "@/types/appointments/appointment-type";
import type { ClientItem } from "@/types/clients/client.type";
import type {
  ConsultationItem,
  CreateConsultationPayload,
  UpdateConsultationPayload,
} from "@/types/medical-records/medical-record.type";
import type { PetItem } from "@/types/pets/pet.type";
import { withProcessToast } from "@/lib/feedback/process-toast";

export function useMedicalRecords() {
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [pets, setPets] = useState<PetItem[]>([]);
  const [veterinarians, setVeterinarians] = useState<VeterinarianOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadMedicalRecords = useCallback(async () => {
    try {
      setIsLoading(true);

      const [
        consultationsResponse,
        appointmentsResponse,
        clientsResponse,
        petsResponse,
        veterinariansResponse,
      ] = await Promise.all([
        fetchConsultations(),
        fetchAppointments(),
        fetchClients(),
        fetchPets(),
        fetchVeterinarians(),
      ]);

      setConsultations(consultationsResponse);
      setAppointments(appointmentsResponse);
      setClients(clientsResponse);
      setPets(petsResponse);
      setVeterinarians(veterinariansResponse);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible cargar las fichas clínicas.";

      toast.error("No se pudieron cargar las fichas clínicas", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMedicalRecords();
  }, [loadMedicalRecords]);

  const handleCreateMedicalRecord = useCallback(
    async (payload: CreateConsultationPayload) => {
      try {
        setIsMutating(true);

        await withProcessToast(
          async () => {
            await createConsultation(payload);
            await loadMedicalRecords();
          },
          {
            loading: "Creando ficha clínica...",
            success: "Ficha clínica creada correctamente",
            successDescription: "El registro clínico quedó guardado.",
            error: "No se pudo crear la ficha clínica",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [loadMedicalRecords],
  );

  const handleUpdateMedicalRecord = useCallback(
    async (consultationId: string, payload: UpdateConsultationPayload) => {
      try {
        setIsMutating(true);

        await withProcessToast(
          async () => {
            await updateConsultation(consultationId, payload);
            await loadMedicalRecords();
          },
          {
            loading: "Actualizando ficha clínica...",
            success: "Ficha clínica actualizada correctamente",
            successDescription: "Los cambios del registro clínico fueron guardados.",
            error: "No se pudo actualizar la ficha clínica",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [loadMedicalRecords],
  );

  const handleDeleteMedicalRecord = useCallback(
    async (consultation: ConsultationItem) => {
      const result = await Swal.fire({
        icon: "warning",
        title: "¿Eliminar ficha clínica?",
        text: `Se eliminará la ficha de ${consultation.pet_name ?? "la mascota"}.`,
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
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
            await deleteConsultation(consultation.id);
            await loadMedicalRecords();
          },
          {
            loading: "Eliminando ficha clínica...",
            success: "Ficha clínica eliminada correctamente",
            successDescription: "El registro clínico fue retirado del historial.",
            error: "No se pudo eliminar la ficha clínica",
          },
        );
      } finally {
        setIsMutating(false);
      }
    },
    [loadMedicalRecords],
  );

  const recordsCount = useMemo(() => consultations.length, [consultations]);

  return {
    consultations,
    appointments,
    clients,
    pets,
    veterinarians,
    isLoading,
    isMutating,
    recordsCount,
    handleCreateMedicalRecord,
    handleUpdateMedicalRecord,
    handleDeleteMedicalRecord,
  };
}
