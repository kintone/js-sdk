// FIXME: クライアントをモックしてテスト実行できるようにする

import { createClient } from "../../client";
import { iterator } from "../../helpers/iterator";

const main = async () => {
  const client = createClient({
    baseUrl: "http://localhost",
    auth: {
      type: "password",
      username: "Administrator",
      password: "cybozu",
    },
  });

  // アプリ作成
  const apps: Array<{ app: number }> = [];
  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line new-cap
    const addAppResp = await client.POST("/k/v1/preview/app.json", {
      body: { name: `my app ${i}` },
    });
    console.log(addAppResp);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    apps.push({ app: addAppResp.data!.app! });
  }
  // デプロイ
  // eslint-disable-next-line new-cap
  await client.POST("/k/v1/preview/app/deploy.json", {
    body: { apps: apps },
  });

  const appIdList = apps.map((a) => a.app);

  // デプロイ確認
  // eslint-disable-next-line new-cap
  const deployCheckIterator = iterator(client).GET(
    "/k/v1/preview/app/deploy.json",
    (init) => init,
    (_init, resp) => {
      if (!resp) {
        return true;
      }
      // TODO: add error handing for the case resp is undefined
      for (const status of resp?.data?.apps ?? []) {
        if (
          apps.some((a) => a.app === status.app) &&
          status.status === "PROCESSING"
        ) {
          return true;
        }
      }
      return false;
    },
    {
      params: {
        query: { apps: appIdList },
      },
    },
  );
  while (true) {
    const result = await deployCheckIterator.next();
    if (result.done) {
      break;
    }
    console.log("deploying...");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // アプリ一覧取得
  const handleRequest = (previousInit: any, previousResp: any) => {
    if (!previousResp) {
      return previousInit;
    }
    const prevOffset = parseInt(previousInit.params?.query?.offset, 10);
    const limit = parseInt(previousInit.params?.query?.limit, 10);
    return {
      ...previousInit,
      params: {
        ...previousInit?.params,
        query: {
          ...previousInit?.params?.query,
          offset: prevOffset + limit,
        },
      },
    };
  };
  const hasNext = (init: any, resp: any) => {
    if (!resp) {
      return true;
    }
    return (
      parseInt(resp.data?.apps?.length, 10) >=
      parseInt(init.params.query.limit, 10)
    );
  };

  // eslint-disable-next-line new-cap
  const getAppsIterator = iterator(client).GET(
    "/k/v1/apps.json",
    handleRequest,
    hasNext,
    {
      params: {
        query: {
          ids: appIdList,
          offset: 0,
          limit: 3,
        },
      },
    },
  );
  const allResp = [];
  for await (const resp of getAppsIterator) {
    console.log(resp.data);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    allResp.push(...resp.data!.apps!);
  }
  console.log(allResp.length);
};

const mainForKintoneApi = async () => {
  const kintone = createClient({
    baseUrl: "http://localhost",
    auth: {
      type: "password",
      username: "Administrator",
      password: "cybozu",
    },
  });

  // アプリ作成
  const apps: Array<{ app: number }> = [];
  for (let i = 0; i < 10; i++) {
    const addAppResp = await kintone.api("/k/v1/preview/app.json", "post", {
      name: `my app ${i}`,
    });
    console.log(addAppResp);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    apps.push({ app: addAppResp.data!.app! });
  }
  // デプロイ

  await kintone.api("/k/v1/preview/app/deploy.json", "post", {
    apps: apps,
  });

  const appIdList = apps.map((a) => a.app);

  // デプロイ確認

  const deployCheckIterator = iterator(kintone).api(
    "/k/v1/preview/app/deploy.json",
    "get",
    {
      apps: appIdList,
    },
    (init) => init,
    (_init, resp) => {
      if (!resp) {
        return true;
      }
      // TODO: add error handing for the case resp is undefined
      for (const status of resp?.data?.apps ?? []) {
        if (
          apps.some((a) => a.app === status.app) &&
          status.status === "PROCESSING"
        ) {
          return true;
        }
      }
      return false;
    },
  );
  while (true) {
    const result = await deployCheckIterator.next();
    if (result.done) {
      break;
    }
    console.log("deploying...");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // アプリ一覧取得
  const handleRequest = (previousInit: any, previousResp: any) => {
    if (!previousResp) {
      return previousInit;
    }
    const prevOffset = parseInt(previousInit.offset, 10);
    const limit = parseInt(previousInit.limit, 10);
    return {
      offset: prevOffset + limit,
      limit,
    };
  };
  const hasNext = (init: any, resp: any) => {
    if (!resp) {
      return true;
    }
    return parseInt(resp.data?.apps?.length, 10) >= parseInt(init.limit, 10);
  };

  const getAppsIterator = iterator(kintone).api(
    "/k/v1/apps.json",
    "get",
    {
      ids: appIdList,
      offset: 0,
      limit: 3,
    },
    handleRequest,
    hasNext,
  );
  const allResp = [];
  for await (const resp of getAppsIterator) {
    console.log(resp.data);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    allResp.push(...resp.data!.apps!);
  }
  console.log(allResp.length);
};

// TODO: Use Jest
// main();
mainForKintoneApi();
