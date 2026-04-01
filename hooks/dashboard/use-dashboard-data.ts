"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchDashboardData } from "@/api/dashboard/dashboard-api";
import type { DashboardData } from "@/types/dashboard/dashboard.type";

type UseDashboardDataResult = {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  errorMessage: string | null;
  refreshDashboard: () => Promise<void>;
};

export function useDashboardData(): UseDashboardDataResult {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetchDashboardData();
      setDashboardData(response);
    } catch (error) {
      const parsedMessage =
        error instanceof Error
          ? error.message
          : "No fue posible cargar el dashboard.";

      setErrorMessage(parsedMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    dashboardData,
    isLoading,
    errorMessage,
    refreshDashboard: loadDashboard,
  };
}