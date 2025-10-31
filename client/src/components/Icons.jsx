import { createElement, Eye, EyeOff, Info, TriangleAlert } from 'lucide';

const icon = (iconEl, { size = 18, strokeWidth = 1, color = 'currentColor', ...rest } = {}) => (
  <span
    className="lu-icon"
    ref={(el) => {
      if (el) {
        el.innerHTML = "";
        el.appendChild(createElement(iconEl, {
          width: size,
          height: size,
          stroke: color,
          strokeWidth: strokeWidth,
          ...rest
        }));
      }
    }}
  />
);

export const LuEye = (props) => icon(Eye, props);
export const LuEyeOff = (props) => icon(EyeOff, props);
export const LuTriangleAlert = (props) => icon(TriangleAlert, props);
export const LuInfo = (props) => icon(Info, props);
