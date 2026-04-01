import { fetchAppointments } from "@/api/appointments/appointments.api";
import { fetchClients } from "@/api/clients/clients.api";
import { fetchConsultations } from "@/api/medical-records/medical-records.api";
import { fetchPets, fetchSpecies } from "@/api/pets/pets.api";
import { fetchVeterinarians } from "@/api/veterinarian/veterinarian.api";
import { fetchWorkingHours } from "@/api/working-hours/working-hours.api";

import type { AppointmentItem } from "@/types/appointments/appointment-type";
import type { ClientItem } from "@/types/clients/client.type";
import type { ConsultationItem } from "@/types/medical-records/medical-record.type";
import type { PetItem, SpeciesOption } from "@/types/pets/pet.type";
import type { VeterinarianItem } from "@/types/veterinarian/veterinarian.type";
import type { WorkingHourItem } from "@/types/working-hours/working-hour.type";
import type { DashboardData } from "@/types/dashboard/dashboard.type";

function formatDateLabel(dateValue: string): string {
  const date = new Date(dateValue);

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatTimeLabel(dateValue: string): string {
  const date = new Date(dateValue);

  return new Intl.DateTimeFormat("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function buildNextSevenDaysLabels(): string[] {
  const labels: string[] = [];
  const currentDate = new Date();

  for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + dayIndex);

    labels.push(
      new Intl.DateTimeFormat("es-CL", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      }).format(date)
    );
  }

  return labels;
}

function normalizeAppointmentStatus(statusValue?: string | null): string {
  if (!statusValue) {
    return "Sin estado";
  }

  const normalizedStatus = statusValue.trim().toUpperCase();

  const statusMap: Record<string, string> = {
    SCHEDULED: "Programada",
    CONFIRMED: "Confirmada",
    CHECKED_IN: "Check-in",
    IN_PROGRESS: "En curso",
    COMPLETED: "Completada",
    CANCELLED: "Cancelada",
    NO_SHOW: "No asistió",
  };

  return statusMap[normalizedStatus] ?? statusValue;
}

function normalizeBookedSource(sourceValue?: string | null): string {
  if (!sourceValue) {
    return "Sin origen";
  }

  const normalizedSource = sourceValue.trim().toLowerCase();

  const sourceMap: Record<string, string> = {
    admin: "Administración",
    internal: "Administración",
    client_portal: "Portal Cliente",
    portal: "Portal Cliente",
    guest: "Portal Invitado",
    guest_portal: "Portal Invitado",
    public: "Portal Invitado",
    whatsapp: "WhatsApp",
    phone: "Teléfono",
  };

  return sourceMap[normalizedSource] ?? sourceValue;
}

function getChartItems(map: Map<string, number>) {
  return Array.from(map.entries()).map(([label, value]) => ({
    label,
    value,
  }));
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const [
    clients,
    pets,
    species,
    veterinarians,
    appointments,
    consultations,
    workingHours,
  ] = await Promise.all([
    fetchClients(),
    fetchPets(),
    fetchSpecies(),
    fetchVeterinarians(),
    fetchAppointments(),
    fetchConsultations(),
    fetchWorkingHours(),
  ]);

  const clientsById = new Map<string, ClientItem>(
    clients.map((client) => [client.id, client])
  );

  const petsById = new Map<string, PetItem>(
    pets.map((pet) => [pet.id, pet])
  );

  const veterinariansById = new Map<string, VeterinarianItem>(
    veterinarians.map((veterinarian) => [veterinarian.id, veterinarian])
  );

  const speciesById = new Map<string, SpeciesOption>(
    species.map((speciesItem) => [speciesItem.id, speciesItem])
  );

  const currentDate = new Date();

  const upcomingAppointments = appointments
    .filter((appointment: AppointmentItem) => {
      return new Date(appointment.starts_at) >= currentDate;
    })
    .sort((firstAppointment, secondAppointment) => {
      return (
        new Date(firstAppointment.starts_at).getTime() -
        new Date(secondAppointment.starts_at).getTime()
      );
    });

  const appointmentStatusMap = new Map<string, number>();
  appointments.forEach((appointment: AppointmentItem) => {
    const statusLabel = normalizeAppointmentStatus(appointment.status);
    appointmentStatusMap.set(
      statusLabel,
      (appointmentStatusMap.get(statusLabel) ?? 0) + 1
    );
  });

  const petsBySpeciesMap = new Map<string, number>();
  pets.forEach((pet: PetItem) => {
    const speciesName =
      pet.species?.name ||
      speciesById.get(pet.species_id)?.name ||
      "Sin especie";

    petsBySpeciesMap.set(
      speciesName,
      (petsBySpeciesMap.get(speciesName) ?? 0) + 1
    );
  });

  const appointmentsBySourceMap = new Map<string, number>();
  appointments.forEach((appointment: AppointmentItem) => {
    const sourceLabel = normalizeBookedSource(appointment.booked_source);
    appointmentsBySourceMap.set(
      sourceLabel,
      (appointmentsBySourceMap.get(sourceLabel) ?? 0) + 1
    );
  });

  const nextSevenDayLabels = buildNextSevenDaysLabels();
  const appointmentsByDayMap = new Map<string, number>(
    nextSevenDayLabels.map((label) => [label, 0])
  );

  upcomingAppointments.forEach((appointment: AppointmentItem) => {
    const dayLabel = new Intl.DateTimeFormat("es-CL", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    }).format(new Date(appointment.starts_at));

    if (appointmentsByDayMap.has(dayLabel)) {
      appointmentsByDayMap.set(
        dayLabel,
        (appointmentsByDayMap.get(dayLabel) ?? 0) + 1
      );
    }
  });

  const recentConsultations = [...consultations]
    .sort((firstConsultation: ConsultationItem, secondConsultation: ConsultationItem) => {
      return (
        new Date(secondConsultation.created_at ?? 0).getTime() -
        new Date(firstConsultation.created_at ?? 0).getTime()
      );
    })
    .slice(0, 5);

  return {
    summaryCards: {
      totalClients: clients.length,
      totalPets: pets.length,
      totalVeterinarians: veterinarians.length,
      totalConsultations: consultations.length,
      upcomingAppointments: upcomingAppointments.length,
      activeWorkingHours: workingHours.filter(
        (workingHour: WorkingHourItem) => workingHour.is_active
      ).length,
    },
    appointmentStatusChart: getChartItems(appointmentStatusMap),
    petsBySpeciesChart: getChartItems(petsBySpeciesMap),
    appointmentsByNextDaysChart: getChartItems(appointmentsByDayMap),
    appointmentsBySourceChart: getChartItems(appointmentsBySourceMap),
    upcomingAppointmentsTable: upcomingAppointments.slice(0, 6).map((appointment) => {
      const pet = appointment.pet_id ? petsById.get(appointment.pet_id) : undefined;
      const client = appointment.client_id
        ? clientsById.get(appointment.client_id)
        : undefined;
      const veterinarian = appointment.veterinarian_id
        ? veterinariansById.get(appointment.veterinarian_id)
        : undefined;

      return {
        id: appointment.id,
        dateLabel: formatDateLabel(appointment.starts_at),
        timeLabel: formatTimeLabel(appointment.starts_at),
        petName: appointment.pet_name || pet?.name || "Mascota sin nombre",
        clientName: appointment.client_name || client?.full_name || "Cliente sin nombre",
        veterinarianName:
          appointment.veterinarian_name ||
          veterinarian?.full_name ||
          "Sin asignar",
        status: normalizeAppointmentStatus(appointment.status),
      };
    }),
    recentConsultationsTable: recentConsultations.map((consultation) => {
      const pet = consultation.pet_id ? petsById.get(consultation.pet_id) : undefined;
      const veterinarian = consultation.veterinarian_id
        ? veterinariansById.get(consultation.veterinarian_id)
        : undefined;

      return {
        id: consultation.id,
        petName: consultation.pet_name || pet?.name || "Mascota sin nombre",
        veterinarianName:
          consultation.veterinarian_name ||
          veterinarian?.full_name ||
          "Sin asignar",
        diagnosis: consultation.diagnosis || "Sin diagnóstico",
        summary: consultation.summary || "Sin resumen clínico",
      };
    }),
  };
}