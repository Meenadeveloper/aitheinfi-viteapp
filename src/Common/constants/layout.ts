const LAYOUT_TYPES = {
  VERTICAL: "vertical",
  HORIZONTAL: "horizontal",
} as const;
type LAYOUT_TYPES = (typeof LAYOUT_TYPES)[keyof typeof LAYOUT_TYPES];

const LAYOUT_SEMI_DARK = {
  LIGHT: "light",
  DARK: "dark",
} as const;
type LAYOUT_SEMI_DARK =
  (typeof LAYOUT_SEMI_DARK)[keyof typeof LAYOUT_SEMI_DARK];

const LAYOUT_SKIN = {
  DEFAULT: "default",
  BORDERED: "bordered",
} as const;
type LAYOUT_SKIN = (typeof LAYOUT_SKIN)[keyof typeof LAYOUT_SKIN];

const LAYOUT_MODE_TYPES = {
  LIGHTMODE: "light",
  DARKMODE: "dark",
} as const;
type LAYOUT_MODE_TYPES =
  (typeof LAYOUT_MODE_TYPES)[keyof typeof LAYOUT_MODE_TYPES];

const LAYOUT_DIRECTION = {
  LTR: "ltr",
  RTL: "rtl",
} as const;
type LAYOUT_DIRECTION =
  (typeof LAYOUT_DIRECTION)[keyof typeof LAYOUT_DIRECTION];

const LAYOUT_CONTENT_WIDTH = {
  FLUID: "fluid",
  BOXED: "boxed",
} as const;
type LAYOUT_CONTENT_WIDTH =
  (typeof LAYOUT_CONTENT_WIDTH)[keyof typeof LAYOUT_CONTENT_WIDTH];

const LEFT_SIDEBAR_SIZE_TYPES = {
  DEFAULT: "lg",
  COMPACT: "md",
  SMALLICON: "sm",
} as const;
type LEFT_SIDEBAR_SIZE_TYPES =
  (typeof LEFT_SIDEBAR_SIZE_TYPES)[keyof typeof LEFT_SIDEBAR_SIZE_TYPES];

const LEFT_NAVIGATION_TYPES = {
  STICKY: "sticky",
  SCROLL: "scroll",
  BORDERED: "bordered",
  HIDDEN: "hidden",
} as const;
type LEFT_NAVIGATION_TYPES =
  (typeof LEFT_NAVIGATION_TYPES)[keyof typeof LEFT_NAVIGATION_TYPES];

const LEFT_SIDEBAR_COLOR_TYPES = {
  LIGHT: "light",
  DARK: "dark",
  BRAND: "brand",
  MODERN: "modern",
} as const;
type LEFT_SIDEBAR_COLOR_TYPES =
  (typeof LEFT_SIDEBAR_COLOR_TYPES)[keyof typeof LEFT_SIDEBAR_COLOR_TYPES];

const LAYOUT_TOPBAR_THEME_TYPES = {
  LIGHT: "light",
  DARK: "dark",
  BRAND: "brand",
} as const;
type LAYOUT_TOPBAR_THEME_TYPES =
  (typeof LAYOUT_TOPBAR_THEME_TYPES)[keyof typeof LAYOUT_TOPBAR_THEME_TYPES];

export {
  LAYOUT_TYPES,
  LAYOUT_SEMI_DARK,
  LAYOUT_SKIN,
  LAYOUT_MODE_TYPES,
  LAYOUT_DIRECTION,
  LAYOUT_CONTENT_WIDTH,
  LEFT_SIDEBAR_SIZE_TYPES,
  LEFT_NAVIGATION_TYPES,
  LEFT_SIDEBAR_COLOR_TYPES,
  LAYOUT_TOPBAR_THEME_TYPES,
};
