import { VALID_CSS_SELECTOR } from "./consts";
import { addEnding, isNumber, forEach } from "./helpers";
import { addClassPrefix } from "./styles";

const AXIS = {
  left: "X",
  top: "Y",
};

const DIRECTIONS = ["left", "top", "bottom", "right"];

export function addPopupLogic (markup, options) {
  const { handle, closeButton, id } = options;

  closeButton && markup.parentNode
    .querySelector(addClassPrefix(closeButton, id))
    ?.addEventListener("click", () => markup.parentNode.removeChild(markup));
  handle && markup.parentNode
    .querySelector(addClassPrefix(handle, id))
    ?.addEventListener("mousedown", (e) => {
      const el = e.target;
      const shiftX = e.clientX - markup.getBoundingClientRect().left;
      const shiftY = e.clientY - markup.getBoundingClientRect().top;

      function onMouseMove(e) {
        requestAnimationFrame(() => {
          markup.style.left = e.clientX - shiftX + "px";
          markup.style.top = e.clientY - shiftY + "px";
          markup.style.transform = "none";
        });
      }

      function onMouseUp(e) {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        el.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mouseup", onMouseUp);
      el.addEventListener("mouseup", onMouseUp);

      document.addEventListener("mousemove", onMouseMove);
    });

  positionPopup(markup, options);
}

function positionPopup (markup, options) {
  const { left, top, bottom, right } = options;
  markup.style.position = "fixed";
  const { width, height } = markup.getBoundingClientRect();
  

  if (!left && !right) {
    options.left = "center";
  }

  if (!top && !bottom) {
    options.top = "center";
  }

  if (right && !left) {
    delete options.right;
    options.left = document.body.clientWidth - width - right;
  }

  if (bottom && !top) {
    delete options.bottom;
    options.top = window.innerHeight - height - bottom;
  }

  const style = [];
  forEach(options, (dir, dist) => {
    if (DIRECTIONS.includes(dir)) {
      if (dist === "center") {
        return style.push(`${dir}: 50%`, `transform: translate${AXIS[dir]}(-50%)`);
      }
      style.push(`${dir}: ${addEnding(dist, 'px', isNumber(dist))}`);
    }
  });

  options.left === "center" &&
    options.top === "center" &&
    style.push("transform: translate(-50%, -50%)");

  markup.style = `${markup.style.cssText}; ${style.join(";")}`;
}