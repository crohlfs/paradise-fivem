import { func_1636, updateHeritage } from "./shared";
import { addTick, clearTick } from "../addTick";
import MainMenuScene from "./MainMenuScene";
import Controls from "../constants/controls";
import { mums, dads } from "../constants/parents";
import {
  drawItems,
  header,
  batch,
  sprite,
  subtitle,
  optionItem,
  helpNotice,
  standardSpacer
} from "../ui";
import { getLabel } from "../util";

const baseWidth = 1920;
const baseHeight = 1080;
const w = 432 / baseWidth;

function parentsDisplay(mum: number, dad: number) {
  return batch(
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
  );
}

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

  const helpText = [
    "CHARC_H_30",
    "CHARC_H_31",
    "CHARC_H_9",
    "FACE_HER_ST_H"
  ].map(getLabel);

  let i = 0;

  const handle = addTick(() => {
    const m = mums[mum];
    const d = dads[dad];

    const help = helpText ? helpNotice(w, helpText[i]) : [];

    drawItems(
      header(w, getLabel("FACE_TITLE")),
      subtitle(w, "HERITAGE"),
      parentsDisplay(mum, dad),
      optionItem(w, getLabel("FACE_MUMS"), m.name, i === 0),
      optionItem(w, getLabel("FACE_DADS"), d.name, i === 1),
      optionItem(
        w,
        getLabel("FACE_H_DOM"),
        Math.round(shapeMix * 100) + "%",
        i === 2
      ),
      optionItem(
        w,
        getLabel("FACE_H_STON"),
        Math.round(skinMix * 100) + "%",
        i === 3
      ),
      standardSpacer,
      ...help
    )(246 / baseWidth, 46 / baseHeight);

    if (IsControlJustPressed(0, Controls.FrontendCancel)) {
      clearTick(handle);
      MainMenuScene(bodyCam, isMale, mum, dad, shapeMix, skinMix, board, 1);
      PlaySound(
        -1,
        "Zoom_Out",
        "MUGSHOT_CHARACTER_CREATION_SOUNDS",
        false,
        0,
        true
      );
      SetCamActiveWithInterp(bodyCam, faceCam, 400, 3, 8);
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
          updateHeritage(isMale, ped, mum, dad, shapeMix, skinMix);
          break;
        case 1:
          dad--;
          if (dad === -1) dad = dads.length - 1;
          updateHeritage(isMale, ped, mum, dad, shapeMix, skinMix);
          break;
        case 2:
          if (shapeMix > 0) {
            shapeMix -= 0.01;
            updateHeritage(isMale, ped, mum, dad, shapeMix, skinMix);
          }
          break;
        case 3:
          if (skinMix > 0) {
            skinMix -= 0.01;
            updateHeritage(isMale, ped, mum, dad, shapeMix, skinMix);
          }
          break;
      }
    } else if (IsControlJustPressed(0, Controls.FrontendRight)) {
      switch (i) {
        case 0:
          mum++;
          if (mum === mums.length) mum = 0;
          updateHeritage(isMale, ped, mum, dad, shapeMix, skinMix);
          break;
        case 1:
          dad++;
          if (dad === dads.length) dad = 0;
          updateHeritage(isMale, ped, mum, dad, shapeMix, skinMix);
          break;
        case 2:
          if (shapeMix < 1) {
            shapeMix += 0.01;
            updateHeritage(isMale, ped, mum, dad, shapeMix, skinMix);
          }
          break;
        case 3:
          if (skinMix < 1) {
            skinMix += 0.01;
            updateHeritage(isMale, ped, mum, dad, shapeMix, skinMix);
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

  PlaySound(-1, "Zoom_In", "MUGSHOT_CHARACTER_CREATION_SOUNDS", false, 0, true);
  SetCamActiveWithInterp(faceCam, bodyCam, 400, 3, 8);
  const anim = `mp_character_creation@customise@${isMale ? "" : "fe"}male_a`;
  TaskPlayAnim(ped, anim, "face", 1, -1, -1, 513, 1, false, false, false);
}
