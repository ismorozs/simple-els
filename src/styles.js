export function prepareStyles(styleStr) {
  const style = new CSSStyleSheet();
  style.replaceSync(styleStr);
  return [style]; 
}
