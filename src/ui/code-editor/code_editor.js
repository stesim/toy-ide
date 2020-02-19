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
      onkeydown: function(evt) {
        const domElement = this;
        if (document.activeElement === null ||
            !domElement.contains(document.activeElement) ||
            document.activeElement.isContentEditable) {
          return;
        }
        switch (evt.key) {
          case 'ArrowRight': {
            const nextFocusable =
              getNextFocusable(document.activeElement, domElement);
            if (nextFocusable !== null) {
              nextFocusable.focus();
            }
            break;
          }
          case 'ArrowLeft': {
            const previousFocusable =
              getPreviousFocusable(document.activeElement, domElement);
            if (previousFocusable !== null) {
              previousFocusable.focus();
            }
            break;
          }
          case 'ArrowDown': {
            const nextFocusable =
              getNextFocusableOnSameOrHigherLevel(document.activeElement, domElement);
            if (nextFocusable !== null) {
              nextFocusable.focus();
            }
            break;
          }
          case 'ArrowUp': {
            const previousFocusable =
              getPreviousFocusableOnSameOrHigherLevel(document.activeElement, domElement);
            if (previousFocusable !== null) {
              previousFocusable.focus();
            }
            break;
          }
        }
      },
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

function getNextFocusable(referenceElement, boundaryElement) {
  let elementIter = getNextElementInDocumentOrder(referenceElement, boundaryElement);
  while (elementIter !== null && !elementIter.hasAttribute('tabindex')) {
    elementIter = getNextElementInDocumentOrder(elementIter, boundaryElement);
  }
  return elementIter;
}

function getPreviousFocusable(referenceElement, boundaryElement) {
  let elementIter = getPreviousElementInDocumentOrder(referenceElement, boundaryElement);
  while (elementIter !== null && !elementIter.hasAttribute('tabindex')) {
    elementIter = getPreviousElementInDocumentOrder(elementIter, boundaryElement);
  }
  return elementIter;
}

function getNextFocusableOnSameOrHigherLevel(referenceElement, boundaryElement) {
  let elementIter = getNextElementOnSameOrHigherLevel(referenceElement, boundaryElement);
  while (elementIter !== null && !elementIter.hasAttribute('tabindex')) {
    elementIter = getNextElementOnSameOrHigherLevel(elementIter, boundaryElement);
  }
  return elementIter;
}

function getPreviousFocusableOnSameOrHigherLevel(referenceElement, boundaryElement) {
  let elementIter = getPreviousElementOnSameOrHigherLevel(referenceElement, boundaryElement);
  while (elementIter !== null && !elementIter.hasAttribute('tabindex')) {
    elementIter = getPreviousElementOnSameOrHigherLevel(elementIter, boundaryElement);
  }
  return elementIter;
}

function getNextElementInDocumentOrder(referenceElement, boundaryElement) {
  return referenceElement.firstElementChild ||
    getNextElementOnSameOrHigherLevel(referenceElement, boundaryElement);
}

function getPreviousElementInDocumentOrder(referenceElement, boundaryElement) {
  let result = null;
  if (referenceElement.previousElementSibling !== null) {
    result = referenceElement.previousElementSibling;
    while (result.lastElementChild !== null) {
      result = result.lastElementChild;
    }
  } else if (referenceElement.parentElement !== boundaryElement) {
    result = referenceElement.parentElement;
  }
  return result;
}

function getNextElementOnSameOrHigherLevel(referenceElement, boundaryElement) {
  let result = null;
  if (referenceElement.nextElementSibling !== null) {
    result = referenceElement.nextElementSibling;
  } else if (referenceElement.parentElement !== boundaryElement) {
    result = getNextElementOnSameOrHigherLevel(referenceElement.parentElement, boundaryElement);
  }
  return result;
}

function getPreviousElementOnSameOrHigherLevel(referenceElement, boundaryElement) {
  let result = null;
  if (referenceElement.previousElementSibling !== null) {
    result = referenceElement.previousElementSibling;
  } else if (referenceElement.parentElement !== boundaryElement) {
    result = referenceElement.parentElement;
  }
  return result;
}

style.addRules(`
  .code-editor {
    padding: 1em;
    font-family: Source Code Pro, monospace;
    counter-reset: code-editor-line;
  }
  `, `
  .code-editor > ::before {
    counter-increment: code-editor-line;
    content: counter(code-editor-line);
    text-align: right;
    min-width: 2.5em;
    display: inline-block;
    padding-right: 0.25em;
    margin-right: 0.25em;
    color: var(--solarized-base01);
    background-color: var(--solarized-base02);
  }
  `, `
  .code-editor *[contenteditable=true]:focus {
    background-color: var(--solarized-base3);
  }
`);
