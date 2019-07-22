import {
  drawItems,
  batch,
  header,
  rect,
  text,
  subtitle,
  optionItem,
  menuItem,
  disabledItem,
  standardSpacer,
  helpNotice
} from "../ui";
import { addTick, clearTick } from "../addTick";
import { waitFor, delay, getLabel } from "../util";
import { setToDefault, updateHeritage } from "./shared";
import Controls from "../constants/controls";
import HeritageScene from "./HeritageScene";
import FeaturesScene from "./FeaturesScene";
import AppearanceScene from "./AppearanceScene";

const baseWidth = 1920;
const baseHeight = 1080;

const w = 432 / baseWidth;
const itemHeight = 38 / baseHeight;

type Vec4 = [number, number, number, number];
const fadedBlue: Vec4 = [0, 20, 35, 180];
const selectedBlue: Vec4 = [45, 110, 185, 255];

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
      } else if (i === 3) {
        clearTick(handle);
        AppearanceScene(isMale, bodyCam, mum, dad, shapeMix, skinMix, board);
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
        updateHeritage(isMale, ped, mum, dad, shapeMix, skinMix);
        SetModelAsNoLongerNeeded(model);
      })();
    }

    const helpTexts = [
      "FACE_MM_H2",
      "FACE_MM_H3",
      "FACE_MM_H4",
      "FACE_MM_H6",
      "FACE_MM_H7",
      "FACE_MM_H8"
    ].map(getLabel);

    drawItems(
      header(w, getLabel("FACE_TITLE")),
      subtitle(w, getLabel("FACE_MMT")),
      optionItem(
        w,
        getLabel("FACE_SEX"),
        isMale ? getLabel("FACE_MALE") : getLabel("FACE_FEMALE"),
        i === 0
      ),
      menuItem(w, getLabel("FACE_HERI"), i === 1),
      menuItem(w, getLabel("FACE_FEAT"), i === 2),
      menuItem(w, getLabel("FACE_APP"), i === 3),
      disabledItem(w, getLabel("FACE_APPA"), i === 4),
      batch(
        rect(w, itemHeight, ...(i === 5 ? selectedBlue : fadedBlue)),
        text(w, itemHeight, getLabel("FACE_SAVE"), 0, 0.325)
      ),
      standardSpacer,
      ...helpNotice(w, helpTexts[i])
    )(246 / baseWidth, 46 / baseHeight);
  });
}
