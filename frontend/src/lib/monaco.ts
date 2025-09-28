import * as monaco from "monaco-editor";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

Object.assign(self, {
  MonacoEnvironment: {
    getWorker() {
      return new tsWorker();
    },
  },
});

export default monaco;
