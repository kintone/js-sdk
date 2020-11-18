import { Command } from "commander";

export function createCommanderProgram() {
    const program = new Command();

    program
        .option(
            "--demo",
            "Generate Type definition from demo data.",
            false
        )

        .option(
            "--host [host]",
            "A base URL for the Kintone environment. This will be replaced with the --base-url option",
            null
        )
        .option(
            "--base-url [baseUrl]",
            "A base URL for the Kintone environment",
            process.env.KINTONE_BASE_URL
        )
        .option(
            "-u, --username [username]",
            "A username for the Kintone environment",
            process.env.KINTONE_USERNAME
        )
        .option(
            "-p, --password [password]",
            "A password for the Kintone environment",
            process.env.KINTONE_PASSWORD
        )
        .option(
            "--app-id [appId]",
            "id of kintone app",
            null
        )
        .option(
            "--guest-space-id [guestSpaceId]",
            "id of kintone guest space id",
            null
        )
        .option(
            "--preview",
            "set this option if kintone app is in preview mode",
            false
        )
        .option(
            "--type-name [typeName]",
            "type name to be generated",
            "Fields"
        )
        .option(
            "--namespace [namespace]",
            "namespace of type to be generated",
            "kintone.types"
        )
        .option(
            "--proxy-host [proxyHost]",
            "proxy host",
            null
        )
        .option(
            "--proxy-port [proxyPort]",
            "proxy port",
            null
        )
        .option(
            "--basic-auth-username [basicAuthUsername]",
            "A username for basic authentication",
            process.env.KINTONE_BASIC_AUTH_USERNAME || null
        )
        .option(
            "--basic-auth-password [basicAuthPassword]",
            "A password for basic authentication",
            process.env.KINTONE_BASIC_AUTH_PASSWORD || null
        )
        .option(
            "-o, --output [output]",
            "output file name",
            "fields.d.ts"
        );

    return program;
}
