import fs from "fs";
import AdmZip from "adm-zip";

export const verifyPluginZip = (zipPath: string) => {
  expect(fs.existsSync(zipPath)).toBe(true);
  const zip = new AdmZip(zipPath);
  expect(
    zip.getEntries().map((entry: AdmZip.IZipEntry) => entry.entryName)
  ).toStrictEqual(["contents.zip", "PUBKEY", "SIGNATURE"]);
};
