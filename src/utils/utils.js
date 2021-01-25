export function getFormula(stack) {
  return stack.map(el => el.value).join('');
}

export function calculateStack(stack) {
  return Math.round(eval(getFormula(stack)) * 10000) / 10000; // eslint-disable-line no-eval
}

export function updateLastElementPure(newEl) {
  return (array) => {
    let newState = [].concat(array);
    newState[newState.length - 1] = newEl;
    return newState;
  }
}
