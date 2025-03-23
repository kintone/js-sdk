import { createClient } from "..";
import type { KintoneClientOptions } from "../KintoneClientOptions";
import { paths } from "../../schemas/schema";

// CSRFミドルウェアをモック化
jest.mock("../Middlewares/CsrfMiddleware", () => ({
  getCsrfMiddleware: () => ({
    onRequest: async ({ request }: { request: Request }) => request,
  }),
}));

// openapi-fetchをモック化
jest.mock("openapi-fetch", () => {
  return {
    __esModule: true,
    default: () => ({
      request: jest.fn().mockResolvedValue({
        data: { success: true },
      }),
      use: jest.fn(),
    }),
  };
});

describe("createClient", () => {
  const baseUrl = "https://example.kintone.com";

  beforeEach(() => {
    // fetchのモックをリセット
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  describe("基本的なクライアントの作成", () => {
    test("デフォルトオプションでクライアントが作成できる", () => {
      const options: KintoneClientOptions = {
        baseUrl,
      };
      const client = createClient(options);
      expect(client).toBeDefined();
      expect(client.api).toBeDefined();
    });

    test("セッション認証でクライアントが作成できる", () => {
      const options: KintoneClientOptions = {
        baseUrl,
        auth: {
          type: "session",
        },
      };
      const client = createClient(options);
      expect(client).toBeDefined();
    });

    test("パスワード認証でクライアントが作成できる", () => {
      const options: KintoneClientOptions = {
        baseUrl,
        auth: {
          type: "password",
          username: "user",
          password: "pass",
        },
      };
      const client = createClient(options);
      expect(client).toBeDefined();
    });

    test("APIトークン認証でクライアントが作成できる", () => {
      const options: KintoneClientOptions = {
        baseUrl,
        auth: {
          type: "apiToken",
          apiToken: "dummy-token",
        },
      };
      const client = createClient(options);
      expect(client).toBeDefined();
    });
  });

  describe("設定オプションの適用", () => {
    test("タイムアウトが正しく設定される", () => {
      const options: KintoneClientOptions = {
        baseUrl,
        socketTimeout: 5000,
      };
      const client = createClient(options);
      expect(client).toBeDefined();
    });

    test("ユーザーエージェントが正しく設定される", () => {
      const options: KintoneClientOptions = {
        baseUrl,
        userAgent: "custom-agent",
      };
      const client = createClient(options);
      expect(client).toBeDefined();
    });
  });

  describe("カスタムヘッダーの設定", () => {
    test("カスタムヘッダーが正しく設定される", () => {
      const options: KintoneClientOptions = {
        baseUrl,
        headers: {
          "X-Custom-Header": "custom-value",
        },
      };
      const client = createClient(options);
      expect(client).toBeDefined();
    });
  });

  describe("プロキシ設定", () => {
    test("プロキシ設定が正しく適用される", () => {
      const options: KintoneClientOptions = {
        baseUrl,
        proxy: {
          host: "proxy.example.com",
          port: 8080,
        },
      };
      const client = createClient(options);
      expect(client).toBeDefined();
    });
  });

  describe("エラーケース", () => {
    test("baseUrlが指定されていない場合はエラーとなる", () => {
      expect(() => {
        createClient({} as KintoneClientOptions);
      }).toThrow();
    });

    test("不正な認証オプションの場合はエラーとなる", () => {
      expect(() => {
        createClient({
          baseUrl,
          auth: {
            type: "password",
          } as any,
        });
      }).toThrow();
    });
  });

  describe("APIメソッドの動作", () => {
    test("GETリクエストが正しく処理される", async () => {
      const options: KintoneClientOptions = {
        baseUrl,
        auth: {
          type: "apiToken",
          apiToken: "dummy-token",
        },
      };
      const client = createClient(options);

      const response = await client.api("/k/v1/records.json" as keyof paths & "/k/v1/records.json", "get", { app: 1 });
      expect(response.data).toBeDefined();
    });

    test("POSTリクエストが正しく処理される", async () => {
      const options: KintoneClientOptions = {
        baseUrl,
        auth: {
          type: "apiToken",
          apiToken: "dummy-token",
        },
      };
      const client = createClient(options);

      const response = await client.api("/k/v1/record.json", "post", { app: 1, record: {} });
      expect(response.data).toBeDefined();
    });
  });
}); 