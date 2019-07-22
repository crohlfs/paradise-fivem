import { mums, dads } from "../constants/parents";
import HeadOverlays from "../constants/headOverlays";

export function updateHeritage(
  isMale: boolean,
  ped: number,
  mum: number,
  dad: number,
  shapeMix: number,
  skinMix: number
) {
  SetPedHeadBlendData(
    ped,
    mums[mum].id,
    dads[dad].id,
    0,
    mums[mum].id,
    dads[dad].id,
    0,
    isMale ? shapeMix * 0.95 + 0.025 : shapeMix * 0.95 - 0.025,
    skinMix,
    0,
    false
  );
}

export function setToDefault(ped: number) {
  SetPedDefaultComponentVariation(ped);
  SetPedComponentVariation(ped, 2, 1, 0, 0);
  SetPedComponentVariation(ped, 6, 1, 1, 0);
}

export function updateFeatures(ped: number) {
  setEyeBrows(ped, 0, 1);
  SetPedHeadOverlayColor(ped, HeadOverlays.Eyebrows, 1, 1, 1);

  SetPedEyeColor(ped, Math.round(Math.random() * 8));
}

export function setEyeBrows(ped: number, id: number, opacity: number) {
  SetPedHeadOverlay(ped, HeadOverlays.Eyebrows, id, opacity);
}

export function func_1636(
  cam: number,
  focusStart: number,
  blurAmount: number,
  camDofFnumberOfLens: number,
  camDofMaxNearInFocusDistanceBlendLevel: number
) {
  N_0xf55e4046f6f831dc(cam, focusStart);
  N_0xe111a7c0d200cbc5(cam, blurAmount);
  SetCamDofFnumberOfLens(cam, camDofFnumberOfLens);
  SetCamDofMaxNearInFocusDistanceBlendLevel(
    cam,
    camDofMaxNearInFocusDistanceBlendLevel
  );
}
