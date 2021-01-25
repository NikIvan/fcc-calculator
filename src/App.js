import React, {useState, useEffect} from 'react';

import {TAG_NAME_BUTTON} from './utils/constants.js';
import {FormulaElement} from './utils/FormulaElement';
import {updateLastElementPure, getFormula, calculateStack} from './utils/utils';

import './App.css';

const OP_CLEAR = 'AC';
const OP_DOT = '.';
const OP_PLUS = '+';
const OP_MINUS = '-';
const OP_MULTIPLY = '*';
const OP_DIVIDE = '/';
const OP_EQUALS = '=';

const inputTextDefault = '0';
const formulaTextDefault = '0';
const lastOperationDefault = null;
const formulaStackDefault = [
  new FormulaElement({value: inputTextDefault, isDotPressed: false, isOperator: false})
];

function App() {
  const [formulaText, setFormulaText] = useState(formulaTextDefault);
  const [inputText, setInputText] = useState(inputTextDefault);
  const [formulaStack, setFormulaStack] = useState(formulaStackDefault);
  const [lastOperation, setLastOperation] = useState(lastOperationDefault);

  useEffect(() => {
    setFormulaText(getFormula(formulaStack));
  }, [formulaStack]);

  const onControlsClick = (e) => {
    if (e.target.tagName !== TAG_NAME_BUTTON) {
      return;
    }

    const input = e.target.innerHTML;
    let lastElement = formulaStack[formulaStack.length - 1];

    if (input === OP_CLEAR) {
      reset();
      setLastOperation(OP_CLEAR);
      return;
    }

    if (input === OP_EQUALS) {
      if (lastElement == null || lastOperation === OP_EQUALS) {
        return;
      }

      const formulaStackToCalculate = [...formulaStack];
      const {length} = formulaStackToCalculate;

      if (formulaStackToCalculate[length - 1].isOperator) {
        formulaStackToCalculate.pop();
      }

      setFormulaStack(formulaStackToCalculate);
      setInputText(calculateStack(formulaStackToCalculate));
      setLastOperation(OP_EQUALS);
      return;
    }

    const operators = [OP_PLUS, OP_MINUS, OP_MULTIPLY, OP_DIVIDE];
    const isInputOperator = operators.includes(input);

    if (isInputOperator) {
      if (lastElement == null || lastElement.value === input) {
        return;
      }

      if (lastOperation === OP_EQUALS) {
        const newEl = new FormulaElement({value: inputText, isDotPressed: false, isOperator: false});
        setFormulaStack([newEl]);
        lastElement = newEl;
      }

      if (!lastElement.isOperator) {
        const newEl = new FormulaElement({value: input, isDotPressed: false, isOperator: true});
        setFormulaStack(prevState => [...prevState].concat(newEl));
      } else {
        const preLastElement = formulaStack[formulaStack.length - 2];

        if (preLastElement.isOperator) {
          const newEl = new FormulaElement({value: input, isDotPressed: false, isOperator: true});

          setFormulaStack(prevState => {
            const newState = prevState.slice(0, prevState.length - 2);
            newState.push(newEl);
            return newState;
          });
        } else if (input === OP_MINUS) {
          const newEl = new FormulaElement({value: input, isDotPressed: false, isOperator: true});
          setFormulaStack(prevState => [...prevState].concat(newEl));
        } else {
          const newEl = new FormulaElement(lastElement);
          newEl.value = input;
          setFormulaStack(updateLastElementPure(newEl));
        }
      }

      setInputText(input);
      setLastOperation(input);
      return;
    }

    if (input === OP_DOT) {
      if (lastElement.isOperator) {
        const updatedInput = '0.';
        setInputText(updatedInput);
        const newEl = new FormulaElement({value: updatedInput, isOperator: false, isDotPressed: true});
        setFormulaStack(prevState => [...prevState, newEl]);
        return;
      } else {
        if (lastElement.isDotPressed) {
          return;
        }

        const newEl = new FormulaElement(lastElement);
        newEl.isDotPressed = true;
        newEl.value += '.';
        setInputText(newEl.value);
        setFormulaStack(updateLastElementPure(newEl));
        return;
      }
    }

    if (inputText === '0') {
      const newEl = new FormulaElement();
      newEl.value = input;
      setInputText(newEl.value);
      setFormulaStack([newEl]);
      return;
    }

    if (lastElement.isOperator) {
      const newEl = new FormulaElement();
      newEl.value = input;
      setInputText(newEl.value);
      setFormulaStack(prevState => [...prevState, newEl]);
    } else {
      const newEl = new FormulaElement(lastElement);
      newEl.value += input;
      setInputText(newEl.value);
      setFormulaStack(updateLastElementPure(newEl));
    }
  }

  const reset = () => {
    setInputText(inputTextDefault);
    setFormulaText(formulaTextDefault);
    setFormulaStack(formulaStackDefault);
    setLastOperation(lastOperationDefault);
  }

  return (
    <div id="app">
      <div id="calculator">
        <div id="controlBoard">
          <div id="formulaContainer">
            <div id="formula">{formulaText}</div>
          </div>
          <div id="displayContainer">
            <div id="display">{inputText}</div>
          </div>
        </div>
        <div id="controls" onClick={onControlsClick}>
          <button id="clear" className="calc-button">{OP_CLEAR}</button>
          <button id="divide" className="calc-button">{OP_DIVIDE}</button>
          <button id="multiply" className="calc-button">{OP_MULTIPLY}</button>
          <button id="seven" className="calc-button">7</button>
          <button id="eight" className="calc-button">8</button>
          <button id="nine" className="calc-button">9</button>
          <button id="subtract" className="calc-button">{OP_MINUS}</button>
          <button id="four" className="calc-button">4</button>
          <button id="five" className="calc-button">5</button>
          <button id="six" className="calc-button">6</button>
          <button id="add" className="calc-button">{OP_PLUS}</button>
          <button id="one" className="calc-button">1</button>
          <button id="two" className="calc-button">2</button>
          <button id="three" className="calc-button">3</button>
          <button id="equals" className="calc-button">{OP_EQUALS}</button>
          <button id="zero" className="calc-button">0</button>
          <button id="decimal" className="calc-button">{OP_DOT}</button>
        </div>
      </div>
    </div>
  );
}

export default App;
