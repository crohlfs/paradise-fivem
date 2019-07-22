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
  Align,
  optionItem,
  subtitle,
  standardSpacer
} from "../ui";
import { fadedBlack } from "../colors";

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

  const handle = addTick(() => {
    const items = [
      optionItem(w, "Brow", "Custom", i === 0),
      optionItem(w, "Eyes", "Custom", i === 1),
      optionItem(w, "Nose", "Custom", i === 2),
      optionItem(w, "Nose Profile", "Custom", i === 3),
      optionItem(w, "Nose Tip", "Custom", i === 4),
      optionItem(w, "Cheekbones", "Custom", i === 5),
      optionItem(w, "Cheeks", "Custom", i === 6),
      optionItem(w, "Lips", "Custom", i === 7),
      optionItem(w, "Jaw", "Custom", i === 8),
      optionItem(w, "Chin Profile", "Custom", i === 9),
      optionItem(w, "Chin Shape", "Custom", i === 10)
    ].slice(sliceStart, sliceEnd);

    drawItems(
      header(w, "Character Creator"),
      subtitle(w, "FEATURES", `${i + 1}/11`),
      ...items,
      standardSpacer,
      batch(
        rect(w, ih, ...fadedBlack),
        (x, y) => text(w, ih, "↑", 0, 0.325, Align.Center)(x, y - 0.0035),
        (x, y) =>
          text(w, ih, "↓", 0, 0.325, Align.Center)(x, y + 0.0035) - 0.0035
      ),
      standardSpacer,
      rect(w, 3 / baseHeight, 0, 0, 0, 255),
      batch(
        rect(w, ih, ...fadedBlack),
        text(w, ih, "Make changes to your physical Features.", 0, 0.325)
      )
    )(246 / 1920, 46 / 1080);

    if (IsControlJustPressed(0, Controls.FrontendCancel)) {
      clearTick(handle);
      MainMenuScene(bodyCam, isMale, mum, dad, shapeMix, skinMix, board, 2);
      SetCamActiveWithInterp(bodyCam, faceCam, 800, 3, 8);
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

  SetCamActiveWithInterp(faceCam, bodyCam, 800, 3, 8);
  TaskPlayAnim(ped, anim, "face", 1, -1, -1, 513, 1, false, false, false);
}
