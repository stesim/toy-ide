export default class AppController {
  constructor(dataStore, appCommunication, uiCommunication) {
    this._data = dataStore;

    this._appComm = appCommunication;
    this._appComm.subscribe(message => this._onAppMessage(message));

    this._uiComm = uiCommunication;
    this._uiComm.subscribe(message => this._onUiMessage(message));
  }

  _onAppMessage(message) {
    switch (message.type) {
      case 'update-available': {
        const applyUpdate = confirm('An update is available. Do you want to activate it?');
        if (applyUpdate) {
          this._appComm.publish({type: 'activate-update'});
        }
        break;
      }
    }
  }

  _onUiMessage(message) {
    switch (message.type) {
      case 'rename-variable': {
        const {variableId, newName} = message;
        this._renameVariable(variableId, newName);
        break;
      }
      case 'change-variable-initial-value': {
        const {variableId, newValue} = message;
        this._changeVariableInitialValue(variableId, newValue);
        break;
      }
    }
  }

  _renameVariable(variableId, newName) {
    if (isVariableNameValid(newName)) {
      this._updateVariable(variableId, variable => {
        variable.name = newName;
      });
    } else {
      console.error(`invalid variable name: ${newName}`);
    }
  }

  _changeVariableInitialValue(variableId, newValue) {
    this._updateVariable(variableId, variable => {
      try {
        variable.initialValue = valueFromString(newValue, variable.type);
      } catch (error) {
        console.error(error.message);
      }
    });
  }

  _updateVariable(variableId, updateMethod) {
    const variables = this._data.data.variables;
    if (variableId in variables) {
      const updatedVariable = {...variables[variableId]};
      updateMethod(updatedVariable);
      variables[variableId] = updatedVariable;
    } else {
      throw new Error(`unknown variable id: ${variableId}`);
    }
  }
}

function isVariableNameValid(name) {
  return !/[^_a-zA-Z0-9]/.test(name);
}

function valueFromString(valueString, type) {
  switch (type) {
    case 'string': {
      return valueString;
    }
    case 'integer': {
      if (stringIsInteger(valueString)) {
        return parseInt(valueString, 10);
      }
      break;
    }
    case 'real': {
      if (stringIsNumber(valueString)) {
        return parseFloat(valueString);
      }
      break;
    }
  }
  throw new Error(`invalid value for type ${type}: ${valueString}`);
}

function stringIsInteger(value) {
  return !/[^0-9]/.test(value);
}

function stringIsNumber(value) {
  return (+value === +value);
}
