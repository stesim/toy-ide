import Component from '../../../pwa-base/component.js';
import render from '../../../pwa-base/render.js';
import ComponentStyle from '../../../pwa-base/component_style.js';
import VariableDeclaration from './variable_declaration.js';

const style = new ComponentStyle();

export default class CodeEditor extends Component {
  constructor() {
    super();
  }

  $render() {
    return render({
      type: 'div',
      className: style.className('code-editor'),
      children: [
        {type: VariableDeclaration, isConst: true, name: 'foo', initialValue: 'Hello, world!', typeName: 'string'},
      ],
    });
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
