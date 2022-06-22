import { Manifest } from "../../manifest";

export default function createBaseManifest(): Manifest {
  return {
    manifest_version: 1,
    version: 1,
    type: "APP",
    name: {
      en: "sample",
    },
    icon: "image/icon.png",
  };
}
