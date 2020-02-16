import Component from '../../../pwa-base/component.js';
import render from '../../../pwa-base/render.js';
import EditableToken from './editable_token.js';
import ComponentStyle from '../../../pwa-base/component_style.js';
import mapVariable, {} from '../../../pwa-base/map_variable.js';

const style = new ComponentStyle();

export default class VariableDeclaration extends Component {
  constructor() {
    super({
      isConst: false,
      name: '',
      initialValue: undefined,
      typeName: typeof undefined,
    });
  }

  $render() {
    return render({
      type: 'div',
      children: [{
        type: 'span',
        className: style.className('declarator'),
        textContent: mapVariable(
          this.variables.isConst,
          isConst => isConst ? 'const ' : 'let '),
      }, {
        type: EditableToken,
        className: style.className('identifier'),
        textContent: this.variables.name,
      }, {
        type: 'span',
        className: style.className('operator'),
        textContent: ' = ',
      }, {
        type: EditableToken,
        className: mapVariable(
          this.variables.initialValue,
          value => style.className(classNameForValue(value))),
        textContent: mapVariable(
          this.variables.initialValue,
          value => valueToString(value)),
      }, {
        type: 'span',
        className: style.className('type-annotation'),
        textContent: ' : ',
      }, {
        type: 'span',
        className: style.className('type-annotation'),
        textContent: this.variables.typeName,
      }]
    });
  }
}

function classNameForValue(value) {
  if (value === undefined || value === null) {
    return 'other-literal';
  } else if (typeof value === 'string') {
    return 'string-literal';
  } else if (typeof value === 'number') {
    return 'number-literal';
  } else {
    return 'complex-value';
  }
}

function valueToString(value) {
  if (typeof value === 'string') {
    return value;
  } else if (typeof value === 'number') {
    return value.toString();
  } else {
    switch (value) {
      case true      : return 'true';
      case false     : return 'false';
      case null      : return 'null';
      case undefined : return 'undefined';
      default: throw new Error(`unsupported value: ${value}`);
    }
  }
}

style.addRules(`
  .declarator {
    color: var(--solarized-blue);
  }
  `, `
  .identifier {
    font-weight: bold;
  }
  `, `
  .operator {
    color: var(--solarized-base01);
  }
  `, `
  .string-literal {
    color: var(--solarized-orange);
  }
  `, `
  .type-annotation {
    color: var(--solarized-base01);
  }
`);
