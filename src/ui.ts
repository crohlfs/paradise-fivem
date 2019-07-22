import { white, fadedBlack } from "./colors";

const baseHeight = 1080;
const ih = 38 / baseHeight;

export function sprite(w: number, h: number, dict: string, name: string) {
  function drawFunc(x: number, y: number): number {
    DrawSprite(dict, name, x, y + h / 2, w, h, 0, 255, 255, 255, 255);

    return y + h;
  }

  return drawFunc;
}

const LEFT = "L".charCodeAt(0);
const TOP = "T".charCodeAt(0);

export function drawItems(...drawFuncs: ((x: number, y: number) => number)[]) {
  function drawFunc(x: number, y: number) {
    SetScriptGfxAlign(LEFT, TOP);

    for (const f of drawFuncs) {
      y = f(x, y);
    }

    ResetScriptGfxAlign();
  }

  return drawFunc;
}

export function batch(...drawFuncs: ((x: number, y: number) => number)[]) {
  function drawFunc(x: number, y: number) {
    let outY = 0;

    for (const f of drawFuncs) {
      outY = Math.max(f(x, y), outY);
    }

    return outY;
  }

  return drawFunc;
}

export function rect(
  w: number,
  h: number,
  r: number,
  g: number,
  b: number,
  a: number
) {
  function drawFunc(x: number, y: number): number {
    DrawRect(x, y + h / 2, w, h, r, g, b, a);

    return y + h;
  }

  return drawFunc;
}

export function spacer(h: number) {
  function drawFunc(_: number, y: number): number {
    return y + h;
  }

  return drawFunc;
}

export const standardSpacer = spacer(2 / baseHeight);

export enum Align {
  Left,
  Right,
  Center
}

export function text(
  w: number,
  h: number,
  str: string,
  font: number,
  size: number,
  alignment: Align = Align.Left
) {
  function drawFunc(x: number, y: number): number {
    BeginTextCommandDisplayText("STRING");
    SetTextFont(font);
    SetTextColour(255, 255, 255, 255);
    SetTextScale(size, size);

    if (alignment === Align.Right) {
      SetTextWrap(0, w * 1.03);
      SetTextJustification(2);
    }

    AddTextComponentSubstringPlayerName(str);

    const oy = GetTextScaleHeight(size, font) / 4;
    EndTextCommandDisplayText(
      alignment === Align.Center ? x : x - w / 2 + 0.004,
      y + oy
    );

    return y + h;
  }

  return drawFunc;
}

export function header(w: number, str: string) {
  const h = 96 / baseHeight;
  return batch(rect(w, h, 44, 110, 184, 255), text(w, h, str, 1, 0.9));
}

function getLabel(
  isSelected: boolean,
  text: string,
  disabled = false,
  withArrows = false
) {
  return disabled
    ? "~HUD_COLOUR_GREYDARK~" + text
    : isSelected
    ? withArrows
      ? `~s~~HUD_COLOUR_BLACK~← ${text} ~s~~HUD_COLOUR_BLACK~→`
      : "~HUD_COLOUR_BLACK~" + text
    : text;
}

export function disabledItem(w: number, t: string, isSelected: boolean) {
  return batch(
    rect(w, ih, ...(isSelected ? white : fadedBlack)),
    text(w, ih, "~HUD_COLOUR_GREYDARK~" + t, 0, 0.325)
  );
}

export function menuItem(w: number, item: string, isSelected: boolean) {
  return batch(
    rect(w, ih, ...(isSelected ? white : fadedBlack)),
    text(w, ih, getLabel(isSelected, item), 0, 0.325)
  );
}

export function optionItem(
  w: number,
  item: string,
  value: string,
  isSelected: boolean
) {
  return batch(
    rect(w, ih, ...(isSelected ? white : fadedBlack)),
    text(w, ih, getLabel(isSelected, item), 0, 0.325),
    text(w, ih, getLabel(isSelected, value, false, true), 0, 0.325, Align.Right)
  );
}

export function subtitle(w: number, left: string, right?: string) {
  return right
    ? batch(
        rect(w, ih, 0, 0, 0, 255),
        text(w, ih, "~HUD_COLOUR_HB_BLUE~" + left, 0, 0.325),
        text(w, ih, `~HUD_COLOUR_HB_BLUE~` + right, 0, 0.325, Align.Right)
      )
    : batch(
        rect(w, ih, 0, 0, 0, 255),
        text(w, ih, "~HUD_COLOUR_HB_BLUE~" + left, 0, 0.325)
      );
}
