"use client";

import { useMemo, useState } from "react";
import { FileText, Shield } from "lucide-react";

import { useMedicalRecords } from "@/hooks/medical-records/use-medical-records";
import { buildMedicalRecordsColumns } from "@/components/pages/medical-records/table/medical-record-columns";
import { MedicalRecordsDataTable } from "@/components/pages/medical-records/table/medical-record-data-table";
import { MedicalRecordFormDialog } from "@/components/pages/medical-records/dialog/medical-record-form-dialog";
import type { ConsultationItem } from "@/types/medical-records/medical-record.type";

export function MedicalRecordsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] =
    useState<ConsultationItem | null>(null);

  const {
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
  } = useMedicalRecords();

  const columns = useMemo(
    () =>
      buildMedicalRecordsColumns({
        onEdit: (consultation) => setEditingConsultation(consultation),
        onDelete: (consultation) => void handleDeleteMedicalRecord(consultation),
      }),
    [handleDeleteMedicalRecord],
  );

  return (
    <section className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Gestión de fichas clínicas
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Administra fichas clínicas veterinarias y su información médica principal.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Fichas registradas</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {recordsCount}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <FileText className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Fichas activas</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {recordsCount}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Shield className="size-5" />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Cargando fichas clínicas...
        </div>
      ) : (
        <MedicalRecordsDataTable
          columns={columns}
          data={consultations}
          onCreate={() => setIsCreateDialogOpen(true)}
        />
      )}

      <MedicalRecordFormDialog
        mode="create"
        open={isCreateDialogOpen}
        appointments={appointments}
        clients={clients}
        pets={pets}
        veterinarians={veterinarians}
        isSubmitting={isMutating}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={async (values) => {
          await handleCreateMedicalRecord(values);
        }}
        onUpdate={async () => undefined}
      />

      <MedicalRecordFormDialog
        mode="edit"
        open={Boolean(editingConsultation)}
        consultation={editingConsultation}
        appointments={appointments}
        clients={clients}
        pets={pets}
        veterinarians={veterinarians}
        isSubmitting={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setEditingConsultation(null);
          }
        }}
        onCreate={async () => undefined}
        onUpdate={async (consultationId, values) => {
          await handleUpdateMedicalRecord(consultationId, values);
          setEditingConsultation(null);
        }}
      />
    </section>
  );
}