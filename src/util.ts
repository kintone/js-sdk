import { Lang } from "./lang";
import { getBoundMessage } from "./messages";
import { UploadFile } from "./request";

export interface Option {
  watch?: string;
  lang: Lang;
  proxy: string;
  guestSpaceId: number;
}

export function getXCybozuAuthorization(
  username: string,
  password: string
): string {
  const buffer = new Buffer(username + ":" + password);
  return buffer.toString("base64");
}

export async function getCustomizeUploadParams(
  auth: string,
  kintoneUrl: string,
  files: string[],
  contentType: string,
  options: Option
): Promise<any> {
  const m = getBoundMessage(options.lang);

  const exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;
  const regexp = new RegExp(exp);
  return await Promise.all(
    files.map(async (fileOrUrl: string) => {
      const isUrl = Boolean(fileOrUrl.match(regexp));
      if (isUrl) {
        console.log(`${fileOrUrl} ` + m("M_Uploaded"));
        return {
          type: "URL",
          url: fileOrUrl
        };
      } else {
        const { fileKey } = await new UploadFile(
          auth,
          kintoneUrl,
          fileOrUrl,
          contentType,
          options
        ).send();
        console.log(`${fileOrUrl} ` + m("M_Uploaded"));
        return {
          type: "FILE",
          file: {
            fileKey
          }
        };
      }
    })
  );
}
