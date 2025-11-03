import { createElement, Bell, CircleQuestionMark, Eye, EyeOff, HandCoins, Home, Info, LogOut, Menu, TriangleAlert, XCircle } from 'lucide';

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
export const LuBell = (props) => icon(Bell, props);
export const LuMenu = (props) => icon(Menu, props);
export const LuLogOut = (props) => icon(LogOut, props);
export const LuHome = (props) => icon(Home, props);
export const LuXCircle = (props) => icon(XCircle, props);
export const LuHandCoins = (props) => icon(HandCoins, props);
export const LuCircleQuestionMark = (props) => icon(CircleQuestionMark, props);
