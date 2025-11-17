import { createElement, Asterisk, CircleAlert, CircleQuestionMark,  CircleUser, Coins, Eye, EyeOff, HandCoins, Home, Info, LogOut, Mail, Menu, MessageCircleMore, Phone, X } from 'lucide';

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
export const LuCircleAlert = (props) => icon(CircleAlert, props);
export const LuInfo = (props) => icon(Info, props);
export const LuMessageCircle = (props) => icon(MessageCircleMore, props);
export const LuMenu = (props) => icon(Menu, props);
export const LuLogOut = (props) => icon(LogOut, props);
export const LuHome = (props) => icon(Home, props);
export const LuX = (props) => icon(X, props);
export const LuHandCoins = (props) => icon(HandCoins, props);
export const LuCircleQuestionMark = (props) => icon(CircleQuestionMark, props);
export const LuCircleUser = (props) => icon(CircleUser, props);
export const LuCoins = (props) => icon(Coins, props);
export const LuAsterisk = (props) => icon(Asterisk, props);
export const LuMail = (props) => icon(Mail, props);
export const LuPhone = (props) => icon(Phone, props);
