export type PathExcludeGuestSpace<Paths extends {}> = Extract<
  {
    [Path in keyof Paths]: Path extends `${infer _}{guestSpaceId}${infer _}`
      ? never
      : Path;
  }[keyof Paths],
  string
>;

export type PathForGuestSpace<Paths extends {}> = Extract<
  {
    [Path in keyof Paths]: Path extends `${infer _}{guestSpaceId}${infer _}`
      ? Path
      : never;
  }[keyof Paths],
  string
>;
