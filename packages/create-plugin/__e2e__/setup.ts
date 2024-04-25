import { getWorkingDir } from "./utils/generateWorkingDir";
import { rmAsync } from "./utils/helper";
import path from "path";

afterEach(async () => {
  const workingDir = getWorkingDir();
  try {
    await rmAsync(path.resolve(workingDir), { recursive: true });
    console.log(`Working directory ${workingDir} is removed`);
  } catch (err) {
    console.error(err);
  }
});
