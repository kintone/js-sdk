export const buildPath = (params: {
  endpointName: string;
  guestSpaceId?: number | string;
  preview?: boolean;
}) => {
  const { endpointName, guestSpaceId, preview } = params;
  const guestPath = guestSpaceId ? `/guest/${guestSpaceId}` : "";
  const previewPath = preview ? "/preview" : "";
  return `/k${guestPath}/v1${previewPath}/${endpointName}.json`;
};
