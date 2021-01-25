export class FormulaElement {
  constructor(props = {value: '', isDotPressed: false, isOperator: false}) {
    this.value = props.value;
    this.isDotPressed = props.isDotPressed;
    this.isOperator = props.isOperator;
  }
}
