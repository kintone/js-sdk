import { generateWorkingDir, getWorkingDir } from "./utils/generateWorkingDir";

beforeEach(() => {
  generateWorkingDir();
});

afterEach(() => {
  const workingDir = getWorkingDir();
});
