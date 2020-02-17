import Component from '../../../pwa-base/component.js';
import render from '../../../pwa-base/render.js';

export default class EditableToken extends Component {
  constructor() {
    super({
      textContent: undefined,
      isEditable: false,
      className: undefined,
    });

    this.onBeforeContentChange = undefined;
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
    this.variables.isEditable.set(true);
  }

  _endEdit(newContent) {
    this.variables.isEditable.set(false);
    if (this.onBeforeContentChange && newContent !== this._preEditValue) {
      if (this.onBeforeContentChange(newContent, this._preEditValue)) {
        this.variables.textContent.set(newContent);
      } else {
        this._cancelEdit()
      }
    } else {
      this.variables.textContent.set(newContent);
    }
    this._preEditValue = undefined;
  }

  _cancelEdit() {
    this.variables.isEditable.set(false);
    this.variables.textContent.set(undefined);
    this.variables.textContent.set(this._preEditValue);
    this._preEditValue = undefined;
  }
}
