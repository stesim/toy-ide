import Component from '../../pwa-base/component.js';
import { addDataStoreListener, removeDataStoreListener } from '../../pwa-base/data_store.js';
import render from '../../pwa-base/render.js';
import CodeEditor from './code-editor/code_editor.js';

export default class UiRootComponent extends Component {
  constructor(dataStore, controllerCommunication) {
    super({
      numClicks: dataStore.numClicks,
    });

    this._data = dataStore;
    this._storeListener = this._onDataStoreChanged.bind(this);
    addDataStoreListener(this._data, this._storeListener);

    this._comm = controllerCommunication;
  }

  _onDataStoreChanged(key, value) {
    if (key === 'numClicks') {
      this._setVariable(key, value);
    }
  }

  $detach() {
    removeDataStoreListener(this._data, this._storeListener);
  }

  $render() {
    return render(
      {type: 'div', children: [
        {type: CodeEditor},
      ]}
    );
  }
}