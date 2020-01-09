import { buildPath } from "./../url";

test.each`
  endpointName | guestSpaceId | preview      | expected
  ${"record"}  | ${undefined} | ${undefined} | ${"/k/v1/record.json"}
  ${"record"}  | ${undefined} | ${false}     | ${"/k/v1/record.json"}
  ${"record"}  | ${undefined} | ${true}      | ${"/k/v1/preview/record.json"}
  ${"record"}  | ${3}         | ${undefined} | ${"/k/guest/3/v1/record.json"}
  ${"record"}  | ${3}         | ${false}     | ${"/k/guest/3/v1/record.json"}
  ${"record"}  | ${3}         | ${true}      | ${"/k/guest/3/v1/preview/record.json"}
  ${"record"}  | ${"3"}       | ${undefined} | ${"/k/guest/3/v1/record.json"}
  ${"record"}  | ${"3"}       | ${false}     | ${"/k/guest/3/v1/record.json"}
  ${"record"}  | ${"3"}       | ${true}      | ${"/k/guest/3/v1/preview/record.json"}
`("buildPath", ({ endpointName, guestSpaceId, preview, expected }) => {
  expect(buildPath({ endpointName, guestSpaceId, preview })).toBe(expected);
});
