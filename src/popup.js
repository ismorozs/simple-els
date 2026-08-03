import { addEnding, isNumber, forEach } from "./helpers";

const AXIS = {
  left: "X",
  top: "Y",
};

const DIRECTIONS = ["left", "top", "bottom", "right"];

export function addPopupLogic (markup, options) {
  const { handle, closeButton } = options;

  markup.parentNode
    .querySelector(closeButton)
    ?.addEventListener("click", () => markup.parentNode.removeChild(markup));
  markup.parentNode
    .querySelector(handle)
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
  let { left, top, bottom, right } = options;
  const style = ["position: fixed"];

  if (!left && !right) {
    options.left = "center";
  }

  if (!top && !bottom) {
    options.top = "center";
  }

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

  markup.style = `${markup.style}; ${style.join(";")}`;
}