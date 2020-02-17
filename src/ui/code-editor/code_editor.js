import Component from '../../../pwa-base/component.js';
import render from '../../../pwa-base/render.js';
import ComponentStyle from '../../../pwa-base/component_style.js';
import VariableDeclaration from './variable_declaration.js';
import mapVariable from '../../../pwa-base/map_variable.js';
import { addDataStoreListener, removeDataStoreListener } from '../../../pwa-base/data_store.js';

const style = new ComponentStyle();

export default class CodeEditor extends Component {
  constructor(dataStore, controllerCommunication) {
    super({
      scopeVariables: {...dataStore.variables},
    });

    this._data = dataStore;
    this._comm = controllerCommunication;

    this._variableListener = this._onVariableChanged.bind(this);
    addDataStoreListener(
      this._data.variables,
      this._variableListener);
  }

  $render() {
    return render({
      type: 'div',
      className: style.className('code-editor'),
      children: mapVariable(
        this.variables.scopeVariables,
        variables => this._createVariableChildren(variables)),
    });
  }

  $detach() {
    removeDataStoreListener(
      this._data.variables,
      this._variableListener);
  }

  _onVariableChanged(key, value) {
    this.variables.scopeVariables.set(
      {...this._data.variables});
  }

  _createVariableChildren(variables) {
    return Object.entries(variables).map(([id, variable]) => ({
      type: VariableDeclaration,
      isConst: variable.const,
      name: variable.name,
      typeName: variable.type,
      initialValue: variable.initialValue,
      onBeforeNameChange: (newName, currentName) => {
        this._comm.publish({type: 'rename-variable', variableId: id, newName});
        return false;
      },
      onBeforeInitialValueChange: (newValue, currentValue) => {
        this._comm.publish({type: 'change-variable-initial-value', variableId: id, newValue});
        return false;
      },
    }));
  }
}

style.addRules(`
  .code-editor {
    padding: 1em;
    font-family: Source Code Pro, monospace;
  }
  `, `
  .code-editor *[contenteditable=true]:focus {
    background-color: var(--solarized-base3);
  }
`);
