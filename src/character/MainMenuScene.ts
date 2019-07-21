import { drawItems, batch, header, rect, text, spacer, Align } from "../ui";
import { addTick, clearTick } from "../addTick";
import Controls from "../constants/controls";
import { waitFor, delay } from "../util";
import { setToDefault, updateHeritage } from "./shared";
import HeritageScene from "./HeritageScene";
import FeaturesScene from "./FeaturesScene";

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
const fadedBlue: Vec4 = [0, 20, 35, 180];

export default async function(
  bodyCam: number,
  isMale: boolean,
  mum: number,
  dad: number,
  shapeMix: number,
  skinMix: number,
  board: number,
  i: number
) {
  const handle = addTick(() => {
    if (IsControlJustPressed(0, Controls.FrontendAccept)) {
      if (i === 1) {
        clearTick(handle);
        HeritageScene(isMale, bodyCam, mum, dad, shapeMix, skinMix, board);
        return;
      } else if (i === 2) {
        clearTick(handle);
        FeaturesScene(isMale, bodyCam, mum, dad, shapeMix, skinMix, board);
        return;
      }
    } else if (IsControlJustPressed(0, Controls.FrontendUp)) {
      i--;

      if (i == -1) i = 6 - 1;
    } else if (IsControlJustPressed(0, Controls.FrontendDown)) {
      i++;

      if (i == 6) i = 0;
    } else if (
      i === 0 &&
      (IsControlJustPressed(0, Controls.FrontendLeft) ||
        IsControlJustPressed(0, Controls.FrontendRight))
    ) {
      isMale = !isMale;

      (async function() {
        const playerId = PlayerId();
        await waitFor(
          () =>
            GetPlayerPed(playerId) != -1 && !!NetworkIsPlayerActive(playerId)
        );

        let ped = GetPlayerPed(playerId);

        const model = GetHashKey(`mp_${isMale ? "m" : "f"}_freemode_01`);

        RequestModel(model);

        const anim = `mp_character_creation@customise@${
          isMale ? "" : "fe"
        }male_a`;
        RequestAnimDict(anim);

        await waitFor(
          () => !!HasAnimDictLoaded(anim) && !!HasModelLoaded(model)
        );

        await delay(333);

        SetPlayerModel(playerId, model);
        ped = GetPlayerPed(playerId);
        TaskPlayAnim(
          ped,
          anim,
          "loop",
          10000,
          -8,
          -1,
          513,
          1,
          false,
          false,
          false
        );

        AttachEntityToEntity(
          board,
          ped,
          GetPedBoneIndex(ped, 28422),
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          0.0,
          false,
          false,
          false,
          false,
          2,
          true
        );

        setToDefault(ped);
        updateHeritage(ped, mum, dad, shapeMix, skinMix);
        SetModelAsNoLongerNeeded(model);
      })();
    }

    const helpTexts = [
      "Select the gender of your Character.",
      "Select to choose your parents.",
      "Select to alter your facial Features.",
      "Select to change your Appearance.",
      "Select to change your Apparel.",
      "Ready to start playing GTA Online?"
    ];

    drawItems(
      header(w, headerHeight, "Character Creator"),
      batch(
        rect(w, itemHeight, 0, 0, 0, 255),
        text(w, itemHeight, "~HUD_COLOUR_HB_BLUE~NEW CHARACTER", 0, 0.325)
      ),
      batch(
        rect(w, itemHeight, ...(i === 0 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Sex", 0), 0, 0.325),
        text(
          w,
          itemHeight,
          getLabel(i, isMale ? "Male" : "Female", 0, false, true),
          0,
          0.325,
          Align.Right
        )
      ),
      batch(
        rect(w, itemHeight, ...(i === 1 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Heritage", 1), 0, 0.325)
      ),
      batch(
        rect(w, itemHeight, ...(i === 2 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Features", 2), 0, 0.325)
      ),
      batch(
        rect(w, itemHeight, ...(i === 3 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Appearance", 3, true), 0, 0.325)
      ),
      batch(
        rect(w, itemHeight, ...(i === 4 ? white : fadedBlack)),
        text(w, itemHeight, getLabel(i, "Apparel", 4, true), 0, 0.325)
      ),
      batch(
        rect(w, itemHeight, ...(i === 5 ? white : fadedBlue)),
        text(w, itemHeight, getLabel(i, "Save & Continue", 5, true), 0, 0.325)
      ),
      spacer(2 / 1080),
      rect(w, 3 / 1080, 0, 0, 0, 255),
      batch(
        rect(w, itemHeight, ...fadedBlack),
        text(w, itemHeight, helpTexts[i], 0, 0.325)
      )
    )(246 / 1920, 46 / 1080);
  });
}
