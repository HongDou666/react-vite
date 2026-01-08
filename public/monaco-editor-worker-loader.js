// public/monaco-editor-worker-loader.js
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    const baseUrl = import.meta.env.MODE === 'development'
      ? '/node_modules/monaco-editor/esm/vs'
      : './vs';

    const workers = {
      json: 'language/json/json.worker',
      css: 'language/css/css.worker',
      html: 'language/html/html.worker',
      typescript: 'language/typescript/ts.worker',
      javascript: 'language/typescript/ts.worker',
      editor: 'editor/editor.worker'
    };

    const workerType = workers[label] || workers.editor;
    const workerUrl = `${baseUrl}/${workerType}.js`;

    return workerUrl;
  }
};
