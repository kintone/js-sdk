export type GetStatisticsRequest = {
  offset?: number;
  limit?: number;
};

export type AppStatistics = {
  id: string;
  name: string;
  space: {
    id: string;
    name: string;
  } | null;
  appGroup: string;
  status: "CHANGED" | "NOT_ACTIVATED" | "ACTIVATED";
  recordUpdatedAt: string;
  recordCount: string;
  fieldCount: string;
  dailyRequestCount: string;
  storageUsage: string;
  customized: boolean;
  creator: {
    code: string;
    name: string;
  };
  createdAt: string;
  modifier: {
    code: string;
    name: string;
  };
  modifiedAt: string;
};

export type GetStatisticsResponse = {
  apps: AppStatistics[];
};
