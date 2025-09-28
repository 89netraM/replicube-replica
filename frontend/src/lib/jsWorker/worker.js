self.addEventListener("message", onMessage);

/** @param {MessageEvent<any>} e */
async function onMessage(e) {
  if (typeof e.data.id !== "string") {
    return;
  }
  const id = e.data.id;

  if (
    typeof e.data.render?.x !== "number" ||
    typeof e.data.render?.y !== "number" ||
    typeof e.data.render?.z !== "number"
  ) {
    self.postMessage({ result: 0, id });
  }

  try {
    // @ts-ignore: `context` is declared dynamically at runtime
    let result = context.render(e.data.render.x, e.data.render.y, e.data.render.z);
    if (result instanceof Promise) {
      result = await result;
    }
    self.postMessage({ result, id });
  } catch {
    self.postMessage({ result: 0, id });
  }
}
