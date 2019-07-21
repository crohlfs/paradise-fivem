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

export function header(w: number, h: number, str: string) {
  return batch(rect(w, h, 44, 110, 184, 255), text(w, h, str, 1, 0.9));
}
