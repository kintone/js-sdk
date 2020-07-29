type EntityType = "USER" | "GROUP" | "ORGANIZATION";

export type Entity = {
  type: EntityType;
  code: string;
};
