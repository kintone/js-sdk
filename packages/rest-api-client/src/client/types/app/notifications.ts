export type NotificationForResponse = {
  timing: Record<"code" | "daysLater" | "hoursLater", string>;
  filterCond: string;
  title: string;
  targets: [
    {
      entity: Record<"type" | "code", string>;
      includeSubs: boolean;
    }
  ];
};
