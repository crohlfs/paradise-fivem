import { func_1636, setEyeBrows, setMakeup } from "./shared";
import { addTick, clearTick } from "../addTick";
import Controls from "../constants/controls";
import MainMenuScene from "./MainMenuScene";
import {
  drawItems,
  header,
  batch,
  rect,
  text,
  optionItem,
  subtitle,
  standardSpacer,
  separator
} from "../ui";
import { fadedBlack } from "../colors";
import { getLabel } from "../util";
import HeadOverlays from "../constants/headOverlays";
import Components from "../constants/components";

const baseWidth = 1920;
const baseHeight = 1080;
const ih = 38 / baseHeight;
const w = 432 / baseWidth;

const eyeColorCount = 32;
const hairStyleCount = 20;
const eyeBrowCount = 34;
const makeupCount = 42;

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

  let eyeColor = GetPedEyeColor(ped);
  let hairStyle = GetPedDrawableVariation(ped, Components.Hair);
  let eyeBrows = GetPedHeadOverlayValue(ped, HeadOverlays.Eyebrows);
  let makeup = GetPedHeadOverlayValue(ped, HeadOverlays.Makeup);

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
  const anim = `mp_character_creation@customise@${isMale ? "" : "fe"}male_a`;

  let i = 0;
  let sliceStart = 0;
  let sliceEnd = 8;

  const custom = getLabel("FACE_F_P_CUST");

  const handle = addTick(() => {
    const items = [
      optionItem(
        w,
        getLabel("FACE_HAIR"),
        getLabel(`CC_${isMale ? "M" : "F"}_HS_${hairStyle}`),
        i === 0
      ),
      optionItem(
        w,
        getLabel("FACE_F_EYEBR"),
        getLabel("CC_EYEBRW_" + eyeBrows),
        i === 1
      ),
      optionItem(w, getLabel("FACE_F_SKINB"), custom, i === 2),
      optionItem(w, getLabel("FACE_F_SKINA"), custom, i === 3),
      optionItem(w, getLabel("FACE_F_SKC"), custom, i === 4),
      optionItem(w, getLabel("FACE_F_MOLE"), custom, i === 5),
      optionItem(w, getLabel("FACE_F_SUND"), custom, i === 6),
      optionItem(
        w,
        getLabel("FACE_APP_EYE"),
        getLabel("FACE_E_C_" + eyeColor),
        i === 7
      ),
      optionItem(
        w,
        getLabel("FACE_F_EYEM"),
        getLabel("CC_MKUP_" + makeup),
        i === 8
      ),
      optionItem(w, getLabel("FACE_F_BLUSH"), custom, i === 9),
      optionItem(w, getLabel("FACE_F_LIPST"), custom, i === 10)
    ].slice(sliceStart, sliceEnd);

    drawItems(
      header(w, getLabel("FACE_TITLE")),
      subtitle(w, getLabel("FACE_APPT"), `${i + 1}/11`),
      ...items,
      standardSpacer,
      separator(w),
      standardSpacer,
      rect(w, 3 / baseHeight, 0, 0, 0, 255),
      batch(
        rect(w, ih, ...fadedBlack),
        text(w, ih, getLabel("FACE_APP_H"), 0, 0.325)
      )
    )(246 / 1920, 46 / 1080);

    if (IsControlJustPressed(0, Controls.FrontendCancel)) {
      clearTick(handle);
      MainMenuScene(bodyCam, isMale, mum, dad, shapeMix, skinMix, board, 3);
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

      if (i == -1) {
        i = 10;
        sliceStart = 3;
        sliceEnd = 11;
      } else if (i === sliceStart - 1) {
        sliceEnd--;
        sliceStart--;
      }
    } else if (IsControlJustPressed(0, Controls.FrontendDown)) {
      i++;

      if (i == 11) {
        i = 0;
        sliceStart = 0;
        sliceEnd = 8;
      } else if (i === sliceEnd) {
        sliceEnd++;
        sliceStart++;
      }
    } else if (IsControlJustPressed(0, Controls.FrontendRight)) {
      switch (i) {
        case 0: {
          hairStyle++;
          if (hairStyle === hairStyleCount) hairStyle = 0;

          SetPedComponentVariation(ped, 2, hairStyle, 0, 0);
          break;
        }
        case 1: {
          eyeBrows++;
          if (eyeBrows === eyeBrowCount) eyeBrows = 0;

          setEyeBrows(ped, eyeBrows, 1);
          break;
        }
        case 7: {
          eyeColor++;
          if (eyeColor === eyeColorCount) eyeColor = 0;

          SetPedEyeColor(ped, eyeColor);
          break;
        }
        case 8: {
          makeup++;
          if (makeup === makeupCount) makeup = 0;

          setMakeup(ped, makeup, 1);
          break;
        }
      }
    } else if (IsControlJustPressed(0, Controls.FrontendLeft)) {
      switch (i) {
        case 0: {
          hairStyle--;
          if (hairStyle < 0) hairStyle = hairStyleCount - 1;

          SetPedComponentVariation(ped, 2, hairStyle, 0, 0);
          break;
        }
        case 1: {
          eyeBrows--;
          if (eyeBrows < 0) eyeBrows = eyeBrowCount - 1;

          setEyeBrows(ped, eyeBrows, 1);
          break;
        }
        case 7: {
          eyeColor--;
          if (eyeColor < 0) eyeColor = eyeColorCount - 1;

          SetPedEyeColor(ped, eyeColor);
          break;
        }
        case 8: {
          makeup--;
          if (makeup < 0) makeup = makeupCount - 1;

          setMakeup(ped, makeup, 1);
          break;
        }
      }
    }
  });

  func_1636(faceCam, 1.5, 3.5, 0.5, 1);
  ShakeCam(faceCam, "HAND_SHAKE", 0.1);

  PlaySound(-1, "Zoom_In", "MUGSHOT_CHARACTER_CREATION_SOUNDS", false, 0, true);

  SetCamActiveWithInterp(faceCam, bodyCam, 400, 3, 8);
  TaskPlayAnim(ped, anim, "face", 1, -1, -1, 513, 1, false, false, false);
}
