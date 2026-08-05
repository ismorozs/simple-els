export function prepareStyles(prefix, styleStr) {
  const style = new CSSStyleSheet();
  style.replaceSync(styleStr);
  for (let i = 0; i, i < style.rules.length; i++) {
    const { selectorText } = style.rules[i];
    style.rules[i].selectorText = addClassPrefix(selectorText, prefix);
  }
  return [style]; 
}

export function addClassPrefix (str, prefix) {
  return str.replaceAll(".", `.${prefix}`);
}