import { func_1636 } from "./shared";
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

const baseWidth = 1920;
const baseHeight = 1080;
const ih = 38 / baseHeight;
const w = 432 / baseWidth;

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
      optionItem(w, getLabel("FACE_F_BROW"), custom, i === 0),
      optionItem(w, getLabel("FACE_F_EYES"), custom, i === 1),
      optionItem(w, getLabel("FACE_F_NOSE"), custom, i === 2),
      optionItem(w, getLabel("FACE_F_NOSEP"), custom, i === 3),
      optionItem(w, getLabel("FACE_F_NOSET"), custom, i === 4),
      optionItem(w, getLabel("FACE_F_CHEEK"), custom, i === 5),
      optionItem(w, getLabel("FACE_F_CHEEKS"), custom, i === 6),
      optionItem(w, getLabel("FACE_F_LIPS"), custom, i === 7),
      optionItem(w, getLabel("FACE_F_JAW"), custom, i === 8),
      optionItem(w, getLabel("FACE_F_CHIN"), custom, i === 9),
      optionItem(w, getLabel("FACE_F_CHINS"), custom, i === 10)
    ].slice(sliceStart, sliceEnd);

    drawItems(
      header(w, getLabel("FACE_TITLE")),
      subtitle(w, getLabel("FACE_FEATT"), `${i + 1}/11`),
      ...items,
      standardSpacer,
      separator(w),
      standardSpacer,
      rect(w, 3 / baseHeight, 0, 0, 0, 255),
      batch(
        rect(w, ih, ...fadedBlack),
        text(w, ih, getLabel("FACE_FEAT_H"), 0, 0.325)
      )
    )(246 / 1920, 46 / 1080);

    if (IsControlJustPressed(0, Controls.FrontendCancel)) {
      clearTick(handle);
      MainMenuScene(bodyCam, isMale, mum, dad, shapeMix, skinMix, board, 2);
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
    }
  });

  func_1636(faceCam, 1.5, 3.5, 0.5, 1);
  ShakeCam(faceCam, "HAND_SHAKE", 0.1);

  PlaySound(-1, "Zoom_In", "MUGSHOT_CHARACTER_CREATION_SOUNDS", false, 0, true);
  SetCamActiveWithInterp(faceCam, bodyCam, 400, 3, 8);
  TaskPlayAnim(ped, anim, "face", 1, -1, -1, 513, 1, false, false, false);
}
