<script lang="ts">
  import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
  import { onDestroy, onMount } from "svelte";

  let { text = $bindable("") }: { text?: string } = $props();

  let monaco: typeof Monaco;
  let editor: Monaco.editor.IStandaloneCodeEditor;
  let editorElement: HTMLDivElement;
  let editorSizeObserver: ResizeObserver;

  onMount(async () => {
    monaco = (await import("$lib/monaco")).default;

    editor = monaco.editor.create(editorElement, { minimap: { enabled: false }, scrollBeyondLastLine: false });
    const model = monaco.editor.createModel(text, "javascript");
    model.onDidChangeContent(onEditorContentChanged);
    editor.setModel(model);

    editorSizeObserver = new ResizeObserver(onEditorResize);
    editorSizeObserver.observe(editorElement);
  });

  function onEditorResize() {
    editor.layout(undefined, true);
  }

  function onEditorContentChanged(e: Monaco.editor.IModelContentChangedEvent) {
    const model = editor?.getModel();
    if (model == null) {
      return;
    }
    const content = model.getLinesContent().join(e.eol);
    text = content;
  }

  $effect(() => {
    const model = editor?.getModel();
    if (model == null) {
      return;
    }
    model.setValue(text);
  });

  onDestroy(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose());
    editor?.dispose();

    editorSizeObserver?.disconnect();
  });
</script>

<div bind:this={editorElement}></div>

<style>
  div {
    width: 100cqw;
    height: 100cqh;
  }
</style>
