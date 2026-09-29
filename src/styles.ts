export function prepareStyles(prefix: string, styleStr: string) {
  const style = new CSSStyleSheet();
  style.replaceSync(styleStr);
  for (let i = 0; i < style.cssRules.length; i++) {
    const cssRule = style.cssRules[i] as CSSStyleRule;
    cssRule.selectorText = addClassPrefix(cssRule.selectorText, prefix);
  }
  return [style];
}

export function addClassPrefix(str: string, prefix: string) {
  return str.replaceAll(".", `.${prefix}`);
}
