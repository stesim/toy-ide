import Component from '../../pwa-base/component.js';
import { addDataStoreListener, removeDataStoreListener } from '../../pwa-base/data_store.js';
import render from '../../pwa-base/render.js';
import CodeEditor from './code-editor/code_editor.js';

export default class UiRootComponent extends Component {
  constructor(dataStore, controllerCommunication) {
    super({
      editorVariables: {...dataStore.data.variables},
    });

    this._data = dataStore;
    this._comm = controllerCommunication;
  }

  $render() {
    return render(
      {type: 'div', children: [
        new CodeEditor(this._data.data, this._comm),
      ]}
    );
  }
}