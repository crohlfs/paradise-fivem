import { mums, dads } from "../constants/parents";

export function updateHeritage(
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
    shapeMix,
    skinMix,
    0,
    false
  );
}

export function setToDefault(ped: number) {
  SetPedDefaultComponentVariation(ped);
  SetPedComponentVariation(ped, 2, 4, 3, 0);
  SetPedComponentVariation(ped, 6, 1, 1, 0);
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
