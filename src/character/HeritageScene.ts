import { func_1636, updateHeritage } from "./shared";
import { addTick, clearTick } from "../addTick";
import Controls from "../constants/controls";
import MainMenuScene from "./MainMenuScene";
import { waitFor } from "../util";
import { mums, dads } from "../constants/parents";
import {
  drawItems,
  header,
  batch,
  rect,
  text,
  sprite,
  Align,
  spacer
} from "../ui";

const baseWidth = 1920;
const baseHeight = 1080;

const w = 432 / baseWidth;
const headerHeight = 96 / baseHeight;
const itemHeight = 38 / baseHeight;

function getLabel(
  selectedIndex: number,
  text: string,
  itemIndex: number,
  disabled = false,
  withArrows = false
) {
  return disabled
    ? "~HUD_COLOUR_GREYDARK~" + text
    : itemIndex === selectedIndex
    ? withArrows
      ? `~s~~HUD_COLOUR_BLACK~← ${text} ~s~~HUD_COLOUR_BLACK~→`
      : "~HUD_COLOUR_BLACK~" + text
    : text;
}

type Vec4 = [number, number, number, number];
const white: Vec4 = [240, 240, 240, 255];
const fadedBlack: Vec4 = [0, 0, 0, 180];

export default async function(
  isMale: boolean,
  bodyCam: number,
  mum: number,
  dad: number,
  shapeMix: number,
  skinMix: number,
  board: number
) {
  const ped = PlayerPedId();

  let i = 0;

  const handle = addTick(() => {
    const m = mums[mum];
    const d = dads[dad];

    drawItems(
      header(w, headerHeight, "Character Creator"),
      batch(
        rect(w, itemHeight, 0, 0, 0, 255),
        text(w, itemHeight, "~HUD_COLOUR_HB_BLUE~HERITAGE", 0, 0.325)
      ),
      batch(
        sprite(w, 228 / 1080, "pause_menu_pages_char_mom_dad", "mumdadbg"),
        (x, y) =>
          sprite(
            228 / 1920,
            228 / 1080,
            "char_creator_portraits",
            dad > 20 ? "special_male_" + (dad - 21) : "male_" + dad
          )(x + 0.043, y),
        (x, y) =>
          sprite(
            228 / 1920,
            228 / 1080,
            "char_creator_portraits",
            mum > 20 ? "special_female_" + (mum - 21) : "female_" + mum
          )(x - 0.043, y)
      ),
      batch(
        rect(w, itemHeight, ...(i === 0 ? white : fadedBlack)),
        text(
          w,
          itemHeight,
          getLabel(i, IsGameUsingMetricMeasurementSystem() ? "Mum" : "Mom", 0),
          0,
          0.325
        ),
        text(
          w,
          itemHeight,
          getLabel(i, m.name, 0, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 1 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Dad", 1), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, d.name, 1, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 2 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Resemblance", 2), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, Math.round(shapeMix * 100) + "%", 2, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 3 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Skin Tone", 3), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, Math.round(skinMix * 100) + "%", 3, false, true),
          0,
          0.325,
          Align.Right
        )
      )
    )(246 / 1920, 46 / 1080);

    if (IsControlJustPressed(0, Controls.FrontendCancel)) {
      clearTick(handle);
      MainMenuScene(bodyCam, isMale, mum, dad, shapeMix, skinMix, board, 1);
      SetCamActiveWithInterp(bodyCam, faceCam, 800, 3, 8);
      TaskPlayAnim(ped, anim, "loop", 1, -1, -1, 513, 1, false, false, false);
    } else if (IsControlJustPressed(0, Controls.FrontendUp)) {
      i--;

      if (i == -1) i = 4 - 1;
    } else if (IsControlJustPressed(0, Controls.FrontendDown)) {
      i++;

      if (i == 4) i = 0;
    } else if (IsControlJustPressed(0, Controls.FrontendLeft)) {
      switch (i) {
        case 0:
          mum--;
          if (mum === -1) mum = mums.length - 1;
          updateHeritage(ped, mum, dad, shapeMix, skinMix);
          break;
        case 1:
          dad--;
          if (dad === -1) dad = dads.length - 1;
          updateHeritage(ped, mum, dad, shapeMix, skinMix);
          break;
        case 2:
          if (shapeMix > 0) {
            shapeMix -= 0.01;
            updateHeritage(ped, mum, dad, shapeMix, skinMix);
          }
          break;
        case 3:
          if (skinMix > 0) {
            skinMix -= 0.01;
            updateHeritage(ped, mum, dad, shapeMix, skinMix);
          }
          break;
      }
    } else if (IsControlJustPressed(0, Controls.FrontendRight)) {
      switch (i) {
        case 0:
          mum++;
          if (mum === mums.length) mum = 0;
          updateHeritage(ped, mum, dad, shapeMix, skinMix);
          break;
        case 1:
          dad++;
          if (dad === dads.length) dad = 0;
          updateHeritage(ped, mum, dad, shapeMix, skinMix);
          break;
        case 2:
          if (shapeMix < 1) {
            shapeMix += 0.01;
            updateHeritage(ped, mum, dad, shapeMix, skinMix);
          }
          break;
        case 3:
          if (skinMix < 1) {
            skinMix += 0.01;
            updateHeritage(ped, mum, dad, shapeMix, skinMix);
          }
          break;
      }
    }
  });

  const faceCam = CreateCamWithParams(
    "DEFAULT_SCRIPTED_CAMERA",
    402.75,
    -998,
    -98.375,
    -5,
    0,
    0,
    36.97171,
    false,
    0
  );
  func_1636(faceCam, 1.5, 3.5, 0.5, 1);
  ShakeCam(faceCam, "HAND_SHAKE", 0.1);

  SetCamActiveWithInterp(faceCam, bodyCam, 800, 3, 8);
  const anim = `mp_character_creation@customise@${isMale ? "" : "fe"}male_a`;
  TaskPlayAnim(ped, anim, "face", 1, -1, -1, 513, 1, false, false, false);
}
