export type DashboardSummaryCards = {
  totalClients: number;
  totalPets: number;
  totalVeterinarians: number;
  totalConsultations: number;
  upcomingAppointments: number;
  activeWorkingHours: number;
};

export type DashboardChartItem = {
  label: string;
  value: number;
};

export type DashboardUpcomingAppointmentRow = {
  id: string;
  dateLabel: string;
  timeLabel: string;
  petName: string;
  clientName: string;
  veterinarianName: string;
  status: string;
};

export type DashboardRecentConsultationRow = {
  id: string;
  petName: string;
  veterinarianName: string;
  diagnosis: string;
  summary: string;
};

export type DashboardData = {
  summaryCards: DashboardSummaryCards;
  appointmentStatusChart: DashboardChartItem[];
  petsBySpeciesChart: DashboardChartItem[];
  appointmentsByNextDaysChart: DashboardChartItem[];
  appointmentsBySourceChart: DashboardChartItem[];
  upcomingAppointmentsTable: DashboardUpcomingAppointmentRow[];
  recentConsultationsTable: DashboardRecentConsultationRow[];
};