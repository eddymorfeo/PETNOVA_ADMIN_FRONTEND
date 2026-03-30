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

import type { AppointmentItem, VeterinarianOption } from "@/types/appointments/appointment-type";
import type { ClientItem } from "@/types/clients/client.type";
import type {
  ConsultationItem,
  CreateConsultationPayload,
  UpdateConsultationPayload,
} from "@/types/medical-records/medical-record.type";
import type { PetItem } from "@/types/pets/pet.type";

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
        await createConsultation(payload);
        await loadMedicalRecords();

        toast.success("Ficha clínica creada correctamente");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No fue posible crear la ficha clínica.";

        await Swal.fire({
          icon: "error",
          title: "No se pudo crear la ficha clínica",
          text: message,
          confirmButtonColor: "#2563eb",
        });

        throw error;
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
        await updateConsultation(consultationId, payload);
        await loadMedicalRecords();

        toast.success("Ficha clínica actualizada");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No fue posible actualizar la ficha clínica.";

        await Swal.fire({
          icon: "error",
          title: "No se pudo actualizar la ficha clínica",
          text: message,
          confirmButtonColor: "#2563eb",
        });

        throw error;
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
        await deleteConsultation(consultation.id);
        await loadMedicalRecords();

        toast.success("Ficha clínica eliminada");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No fue posible eliminar la ficha clínica.";

        await Swal.fire({
          icon: "error",
          title: "No se pudo eliminar la ficha clínica",
          text: message,
          confirmButtonColor: "#2563eb",
        });
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