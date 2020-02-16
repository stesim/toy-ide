import Component from '../../../pwa-base/component.js';
import render from '../../../pwa-base/render.js';

export default class EditableToken extends Component {
  constructor() {
    super({
      textContent: undefined,
      isEditable: false,
      className: undefined,
    });

    this.onContentChanged = undefined;
    this._preEditValue = undefined;
  }

  $render() {
    return render({
      type: 'span',
      tabIndex: 0,
      className: this.variables.className,
      textContent: this.variables.textContent,
      contentEditable: this.variables.isEditable,
      onpointerdown: (evt) => {
        if (!evt.currentTarget.isContentEditable &&
            document.activeElement === evt.currentTarget) {
          this._beginEdit();
          evt.preventDefault();
        }
      },
      onblur: (evt) => {
        if (this.variables.isEditable.value) {
          this._cancelEdit();
        }
      },
      onkeydown: (evt) => {
        if (evt.key === 'Enter') {
          if (this.variables.isEditable.value) {
            this._endEdit(evt.currentTarget.textContent);
          } else {
            this._beginEdit();
          }
          evt.preventDefault();
        } else if (evt.key === 'Escape') {
          this._cancelEdit();
          evt.preventDefault();
        }
      },
    });
  }

  _beginEdit() {
    this._preEditValue = this.variables.textContent.value;
    this.variables.isEditable.value = true;
  }

  _endEdit(newContent) {
    this.variables.isEditable.value = false;
    if (this.onContentChanged && newContent !== this._preEditValue) {
      if (this.onContentChanged(newContent)) {
        this.variables.textContent.value = newContent;
      } else {
        this._cancelEdit()
      }
    } else {
      this.variables.textContent.value = newContent;
    }
    this._preEditValue = undefined;
  }

  _cancelEdit() {
    this.variables.isEditable.value = false;
    this.variables.textContent.value = undefined;
    this.variables.textContent.value = this._preEditValue;
    this._preEditValue = undefined;
  }
}
