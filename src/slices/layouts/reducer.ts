import { createSlice } from "@reduxjs/toolkit";
//constants
import {
  LAYOUT_TYPES,
  LAYOUT_SEMI_DARK,
  LAYOUT_SKIN,
  LAYOUT_MODE_TYPES,
  LAYOUT_DIRECTION,
  LAYOUT_CONTENT_WIDTH,
  LEFT_SIDEBAR_SIZE_TYPES,
  LEFT_NAVIGATION_TYPES,
  LEFT_SIDEBAR_COLOR_TYPES,
  LAYOUT_TOPBAR_THEME_TYPES
} from "../../Common/constants/layout";

export interface LayoutState {
  layoutType: typeof LAYOUT_TYPES.VERTICAL | typeof LAYOUT_TYPES.HORIZONTAL;
  layoutSemiDarkType:
    | typeof LAYOUT_SEMI_DARK.LIGHT
    | typeof LAYOUT_SEMI_DARK.DARK;
  layoutSkintype: typeof LAYOUT_SKIN.DEFAULT | typeof LAYOUT_SKIN.BORDERED;
  layoutModeType:
    | typeof LAYOUT_MODE_TYPES.LIGHTMODE
    | typeof LAYOUT_MODE_TYPES.DARKMODE;
  layoutDirectionType:
    | typeof LAYOUT_DIRECTION.LTR
    | typeof LAYOUT_DIRECTION.RTL;
  layoutContentWidthType:
    | typeof LAYOUT_CONTENT_WIDTH.FLUID
    | typeof LAYOUT_CONTENT_WIDTH.BOXED;
  layoutSidebarSizeType:
    | typeof LEFT_SIDEBAR_SIZE_TYPES.DEFAULT
    | typeof LEFT_SIDEBAR_SIZE_TYPES.COMPACT
    | typeof LEFT_SIDEBAR_SIZE_TYPES.SMALLICON;
  layoutNavigationType:
    | typeof LEFT_NAVIGATION_TYPES.STICKY
    | typeof LEFT_NAVIGATION_TYPES.SCROLL
    | typeof LEFT_NAVIGATION_TYPES.BORDERED
    | typeof LEFT_NAVIGATION_TYPES.HIDDEN;
  layoutSidebarColorType:
    | typeof LEFT_SIDEBAR_COLOR_TYPES.LIGHT
    | typeof LEFT_SIDEBAR_COLOR_TYPES.DARK
    | typeof LEFT_SIDEBAR_COLOR_TYPES.BRAND
    | typeof LEFT_SIDEBAR_COLOR_TYPES.MODERN;
  layoutTopbarColorType:
    | typeof LAYOUT_TOPBAR_THEME_TYPES.LIGHT
    | typeof LAYOUT_TOPBAR_THEME_TYPES.DARK
    | typeof LAYOUT_TOPBAR_THEME_TYPES.BRAND;
}

export const initialState: LayoutState = {
  layoutType: LAYOUT_TYPES.VERTICAL,
  layoutSemiDarkType: LAYOUT_SEMI_DARK.LIGHT,
  layoutSkintype: LAYOUT_SKIN.DEFAULT,
  layoutModeType: LAYOUT_MODE_TYPES.LIGHTMODE,
  layoutDirectionType: LAYOUT_DIRECTION.LTR,
  layoutContentWidthType: LAYOUT_CONTENT_WIDTH.FLUID,
  layoutSidebarSizeType: LEFT_SIDEBAR_SIZE_TYPES.DEFAULT,
  layoutNavigationType: LEFT_NAVIGATION_TYPES.STICKY,
  layoutSidebarColorType: LEFT_SIDEBAR_COLOR_TYPES.LIGHT,
  layoutTopbarColorType: LAYOUT_TOPBAR_THEME_TYPES.LIGHT,
};

const LayoutSlice = createSlice({
  name: 'LayoutSlice',
  initialState,
  reducers: {
    changeLayoutAction(state: any, action: any) {
      state.layoutType = action.payload;
    },
    changeLayoutSemiDarkAction(state: any, action: any) {
      state.layoutSemiDarkType = action.payload;
    },
    changeSkinAction(state: any, action: any) {
      state.layoutSkintype = action.payload;
    },
    changeLayoutModeAction(state: any, action: any) {
      state.layoutModeType = action.payload;
    },
    changeDirectionAction(state: any, action: any) {
      state.layoutDirectionType = action.payload;
    },
    changeLayoutContentWidthAction(state: any, action: any) {
      state.layoutContentWidthType = action.payload;
    },
    changeLayoutSidebarSizeAction(state: any, action: any) {
      state.layoutSidebarSizeType = action.payload;
    },
    changeNavigationAction(state: any, action: any) {
      state.layoutNavigationType = action.payload;
    },
    changeLeftSidebarColorTypeAction(state: any, action: any) {
      state.layoutSidebarColorType = action.payload;
    },
    changeLayoutTopbarColorAction(state: any, action: any) {
      state.layoutTopbarColorType = action.payload;
    }
  }
});

export const {
  changeLayoutAction,
  changeLayoutSemiDarkAction,
  changeSkinAction,
  changeLayoutModeAction,
  changeDirectionAction,
  changeLayoutContentWidthAction,
  changeLayoutSidebarSizeAction,
  changeNavigationAction,
  changeLeftSidebarColorTypeAction,
  changeLayoutTopbarColorAction
} = LayoutSlice.actions;

export default LayoutSlice.reducer;