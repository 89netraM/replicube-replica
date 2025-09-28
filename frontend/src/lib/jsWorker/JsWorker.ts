import type { VoxelCallbackResult } from "$lib/three/VoxelCallback";
import workerScript from "./worker.js?raw";

export class JsWorker {
  public static create(js: string): JsWorker {
    const blob = new Blob([`const context = (() => { ${js}; return { render }; })(); ${workerScript}`]);
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    URL.revokeObjectURL(url);
    return new JsWorker(worker);
  }

  private constructor(private readonly worker: Worker) {
    this.invokeRenderingFunction = this.invokeRenderingFunction.bind(this);
  }

  public invokeRenderingFunction(x: number, y: number, z: number): Promise<VoxelCallbackResult> {
    return new Promise((resolve: (result: VoxelCallbackResult) => void, reject: () => void) => {
      const id = crypto.randomUUID();

      const onMessage = (e: MessageEvent<unknown>) => {
        if (!isResultData(e.data) || e.data.id !== id) {
          return;
        }
        this.worker.removeEventListener("message", onMessage);
        this.worker.removeEventListener("error", onError);
        clearTimeout(timeoutId);
        if (e.data.error) {
          reject();
        } else {
          resolve(e.data.result);
        }
      };
      const onError = () => {
        this.worker.removeEventListener("message", onMessage);
        this.worker.removeEventListener("error", onError);
        clearTimeout(timeoutId);
        reject();
      };

      this.worker.addEventListener("message", onMessage);
      this.worker.addEventListener("error", onError);
      const timeoutId = setTimeout(() => reject(), 500);

      this.worker.postMessage({ render: { x, y, z }, id });
    });
  }

  public dispose() {
    this.worker.terminate();
  }
}

function isResultData(data: unknown): data is { result?: number; id: string; error?: true } {
  return (
    data instanceof Object &&
    (!("result" in data) || typeof data.result === "number" || typeof data.result === "undefined") &&
    "id" in data &&
    typeof data.id === "string"
  );
}
