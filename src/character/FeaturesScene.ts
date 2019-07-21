import { func_1636 } from "./shared";
import { addTick, clearTick } from "../addTick";
import Controls from "../constants/controls";
import MainMenuScene from "./MainMenuScene";
import { waitFor } from "../util";
import { drawItems, header, batch, rect, text, spacer, Align } from "../ui";

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
      batch(
        rect(w, itemHeight, ...(i === 0 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Brow", 0), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, "Custom", 0, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 1 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Eyes", 1), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, "Custom", 1, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 2 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Nose", 2), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, "Custom", 2, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 3 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Nose Profile", 3), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, "Custom", 3, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 4 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Nose Tip", 4), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, "Custom", 4, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 5 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Cheekbones", 5), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, "Custom", 5, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 6 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Cheeks", 6), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, "Custom", 6, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 7 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Lips", 7), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, "Custom", 7, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 8 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Jaw", 8), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, "Custom", 8, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 9 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Chin Profile", 9), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, "Custom", 9, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 10 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Chin Shape", 10), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, "Custom", 10, false, true),
          0,
          0.325,
          Align.Right
        )
      )
    ].slice(sliceStart, sliceEnd);

    drawItems(
      header(w, headerHeight, "Character Creator"),
      batch(
        rect(w, itemHeight, 0, 0, 0, 255),
        text(w, itemHeight, "~HUD_COLOUR_HB_BLUE~FEATURES", 0, 0.325),
        text(
          w,
          itemHeight,
          `~HUD_COLOUR_HB_BLUE~${i + 1}/11`,
          0,
          0.325,
          Align.Right
        )
      ),
      ...items,
      spacer(2 / 1080),
      batch(
        rect(w, itemHeight, ...fadedBlack),
        (x, y) =>
          text(w, itemHeight, "↑", 0, 0.325, Align.Center)(x, y - 0.0035),
        (x, y) =>
          text(w, itemHeight, "↓", 0, 0.325, Align.Center)(x, y + 0.0035) -
          0.0035
      ),
      spacer(2 / 1080),
      rect(w, 3 / 1080, 0, 0, 0, 255),
      batch(
        rect(w, itemHeight, ...fadedBlack),
        text(
          w,
          itemHeight,
          "NOT WORKING YET!!!!" /*"Make changes to your physical Features."*/,
          0,
          0.325
        )
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
    // else if (IsControlJustPressed(0, Controls.FrontendLeft)) {
    //   switch (i) {
    //     case 0:
    //       mum--;
    //       if (mum === -1) mum = mums.length - 1;
    //       updateHeritage(ped, mum, dad, shapeMix, skinMix);
    //       break;
    //     case 1:
    //       dad--;
    //       if (dad === -1) dad = dads.length - 1;
    //       updateHeritage(ped, mum, dad, shapeMix, skinMix);
    //       break;
    //     case 2:
    //       if (shapeMix > 0) {
    //         shapeMix -= 0.01;
    //         updateHeritage(ped, mum, dad, shapeMix, skinMix);
    //       }
    //       break;
    //     case 3:
    //       if (skinMix > 0) {
    //         skinMix -= 0.01;
    //         updateHeritage(ped, mum, dad, shapeMix, skinMix);
    //       }
    //       break;
    //   }
    // } else if (IsControlJustPressed(0, Controls.FrontendRight)) {
    //   switch (i) {
    //     case 0:
    //       mum++;
    //       if (mum === mums.length) mum = 0;
    //       updateHeritage(ped, mum, dad, shapeMix, skinMix);
    //       break;
    //     case 1:
    //       dad++;
    //       if (dad === dads.length) dad = 0;
    //       updateHeritage(ped, mum, dad, shapeMix, skinMix);
    //       break;
    //     case 2:
    //       if (shapeMix < 1) {
    //         shapeMix += 0.01;
    //         updateHeritage(ped, mum, dad, shapeMix, skinMix);
    //       }
    //       break;
    //     case 3:
    //       if (skinMix < 1) {
    //         skinMix += 0.01;
    //         updateHeritage(ped, mum, dad, shapeMix, skinMix);
    //       }
    //       break;
    //   }
    // }
  });

  func_1636(faceCam, 1.5, 3.5, 0.5, 1);
  ShakeCam(faceCam, "HAND_SHAKE", 0.1);

  SetCamActiveWithInterp(faceCam, bodyCam, 800, 3, 8);
  TaskPlayAnim(ped, anim, "face", 1, -1, -1, 513, 1, false, false, false);
}
