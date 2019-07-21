import memoizeOne from "memoize-one";
import { drawItems, header, batch, rect, text, spacer, sprite } from "./ui";
import { mums, dads } from "./constants/parents";
import Controls from "./constants/controls";

function waitFor(checkFn: () => boolean, timeout = 0) {
  return () =>
    new Promise(resolve => {
      (function check() {
        if (checkFn()) {
          resolve();
        } else {
          setTimeout(check, timeout);
        }
      })();
    });
}

function freezePlayer(id: number, freeze: boolean) {
  const player = id;
  SetPlayerControl(player, !freeze, 0);

  const ped = GetPlayerPed(player);

  if (!freeze) {
    if (!IsEntityVisible(ped)) {
      SetEntityVisible(ped, true, false);
    }

    if (!IsPedInAnyVehicle(ped, false)) {
      SetEntityCollision(ped, true, false);
    }

    FreezeEntityPosition(ped, false);
    SetPlayerInvincible(player, false);
  } else {
    if (IsEntityVisible(ped)) {
      SetEntityVisible(ped, false, false);
    }

    SetEntityCollision(ped, false, false);
    FreezeEntityPosition(ped, true);
    SetPlayerInvincible(player, true);

    if (!IsPedFatallyInjured(ped)) {
      ClearPedTasksImmediately(ped);
    }
  }
}

function delay(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function CreateNamedRenderTargetForModel(name: string, model: number) {
  let handle = 0;
  if (!IsNamedRendertargetRegistered(name)) {
    RegisterNamedRendertarget(name, false);
  }
  if (!IsNamedRendertargetLinked(model)) {
    LinkNamedRendertarget(model);
  }
  if (IsNamedRendertargetRegistered(name)) {
    handle = GetNamedRendertargetRenderId(name);
  }

  return handle;
}

function drawMugshotBoard(
  render: number,
  scaleform: number,
  title: string,
  header: string,
  body: string,
  footer: string,
  level: number
) {
  BeginScaleformMovieMethod(scaleform, "SET_BOARD");
  PushScaleformMovieMethodParameterString(title);
  PushScaleformMovieMethodParameterString(body);
  PushScaleformMovieMethodParameterString(footer);
  PushScaleformMovieMethodParameterString(header);
  PushScaleformMovieFunctionParameterInt(0);
  PushScaleformMovieFunctionParameterInt(level);
  PushScaleformMovieFunctionParameterInt(0);
  EndScaleformMovieMethod();

  SetTextRenderId(render);
  SetUiLayer(4);
  SetScriptGfxDrawBehindPausemenu(true);
  DrawScaleformMovie(scaleform, 0.405, 0.37, 0.81, 0.74, 255, 255, 255, 255, 0);
  SetScriptGfxDrawBehindPausemenu(false);
  SetTextRenderId(GetDefaultScriptRendertargetRenderId());
}

function func_1636(
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

const drawMenu = memoizeOne(function(
  route: "root" | "heritage",
  si: number,
  isMale: boolean,
  mum: number,
  dad: number,
  shapeMix: number,
  skinMix: number
) {
  switch (route) {
    case "root": {
      const helpTexts = [
        "Select the gender of your Character.",
        "Select to choose your parents.",
        "Select to alter your facial Features.",
        "Select to change your Appearance.",
        "Select to change your Apparel.",
        "Ready to start playing GTA Online?"
      ];

      return drawItems(
        header(w, headerHeight, "Character Creator"),
        batch(
          rect(w, itemHeight, 0, 0, 0, 255),
          text(w, itemHeight, "~HUD_COLOUR_HB_BLUE~NEW CHARACTER", 0, 0.325)
        ),
        batch(
          rect(w, itemHeight, ...(si === 0 ? white : fadedBlack)),
          text(w, itemHeight, getLabel(si, "Sex", 0), 0, 0.325),
          text(
            w,
            itemHeight,
            getLabel(si, isMale ? "Male" : "Female", 0, false, true),
            0,
            0.325,
            true
          )
        ),
        batch(
          rect(w, itemHeight, ...(si === 1 ? white : fadedBlack)),
          text(w, itemHeight, getLabel(si, "Heritage", 1), 0, 0.325)
        ),
        batch(
          rect(w, itemHeight, ...(si === 2 ? white : fadedBlack)),
          text(w, itemHeight, getLabel(si, "Features", 2, true), 0, 0.325)
        ),
        batch(
          rect(w, itemHeight, ...(si === 3 ? white : fadedBlack)),
          text(w, itemHeight, getLabel(si, "Appearance", 3, true), 0, 0.325)
        ),
        batch(
          rect(w, itemHeight, ...(si === 4 ? white : fadedBlack)),
          text(w, itemHeight, getLabel(si, "Apparel", 4, true), 0, 0.325)
        ),
        batch(
          rect(w, itemHeight, ...(si === 5 ? white : fadedBlue)),
          text(
            w,
            itemHeight,
            getLabel(si, "Save & Continue", 5, true),
            0,
            0.325
          )
        ),
        spacer(2 / 1080),
        rect(w, 3 / 1080, 0, 0, 0, 255),
        batch(
          rect(w, itemHeight, ...fadedBlack),
          text(w, itemHeight, helpTexts[si], 0, 0.325)
        )
      );
    }
    case "heritage": {
      const m = mums[mum];
      const d = dads[dad];

      return drawItems(
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
          rect(w, itemHeight, ...(si === 0 ? white : fadedBlack)),
          text(
            w,
            itemHeight,
            getLabel(
              si,
              IsGameUsingMetricMeasurementSystem() ? "Mum" : "Mom",
              0
            ),
            0,
            0.325
          ),
          text(
            w,
            itemHeight,
            getLabel(si, m.name, 0, false, true),
            0,
            0.325,
            true
          )
        ),
        batch(
          rect(w, itemHeight, ...(si === 1 ? white : fadedBlack)),
          text(w, itemHeight, getLabel(si, "Dad", 1), 0, 0.325),
          text(
            w,
            itemHeight,
            getLabel(si, d.name, 1, false, true),
            0,
            0.325,
            true
          )
        ),
        batch(
          rect(w, itemHeight, ...(si === 2 ? white : fadedBlack)),
          text(w, itemHeight, getLabel(si, "Resemblance", 2), 0, 0.325),
          text(
            w,
            itemHeight,
            getLabel(si, Math.round(shapeMix * 100) + "%", 2, false, true),
            0,
            0.325,
            true
          )
        ),
        batch(
          rect(w, itemHeight, ...(si === 3 ? white : fadedBlack)),
          text(w, itemHeight, getLabel(si, "Skin Tone", 3), 0, 0.325),
          text(
            w,
            itemHeight,
            getLabel(si, Math.round(skinMix * 100) + "%", 3, false, true),
            0,
            0.325,
            true
          )
        )
      );
    }
  }
});

async function spawn() {
  const playerId = PlayerId();
  await waitFor(
    () => GetPlayerPed(playerId) != -1 && !!NetworkIsPlayerActive(playerId)
  );

  let ped = GetPlayerPed(playerId);
  SetEntityVisible(ped, false, false);
  SetPlayerVisibleLocally(playerId, false);
  FreezeEntityPosition(ped, true);

  let state = {
    route: "root" as "root" | "heritage",
    mum: 19,
    dad: 12,
    shapeMix: 0.5,
    skinMix: 0.5,
    hair: 2,
    isMale: true
  };

  const model = GetHashKey(`mp_${state.isMale ? "m" : "f"}_freemode_01`);

  const spawn = {
    x: 404.81,
    y: -997.76,
    z: -98.859
  };

  RequestModel(model);

  const boardScaleform = RequestScaleformMovie("mugshot_board_01");
  let anim = `mp_character_creation@customise@${
    state.isMale ? "" : "fe"
  }male_a`;
  RequestAnimDict(anim);

  await waitFor(
    () =>
      !!HasScaleformMovieLoaded(boardScaleform) &&
      !!HasAnimDictLoaded(anim) &&
      !!HasModelLoaded(model)
  );

  await delay(1000);

  freezePlayer(playerId, true);

  SetPlayerModel(playerId, model);
  ped = GetPlayerPed(playerId);

  SetModelAsNoLongerNeeded(model);

  RequestCollisionAtCoord(spawn.x, spawn.y, spawn.z);

  SetEntityCoordsNoOffset(ped, spawn.x, spawn.y, spawn.z, true, true, true);
  SetEntityVisible(ped, true, false);
  FreezeEntityPosition(ped, false);

  function setToDefault() {
    SetPedDefaultComponentVariation(ped);
    SetPedComponentVariation(ped, 2, 4, 3, 0);
    SetPedComponentVariation(ped, 6, 1, 1, 0);
  }
  setToDefault();

  function updateHeritage() {
    SetPedHeadBlendData(
      ped,
      mums[state.mum].id,
      dads[state.dad].id,
      0,
      mums[state.mum].id,
      dads[state.dad].id,
      0,
      state.shapeMix,
      state.skinMix,
      0,
      false
    );
  }
  updateHeritage();

  const boardModel = GetHashKey("prop_police_id_board");
  const overlayModel = GetHashKey("prop_police_id_text");

  await waitFor(
    () =>
      !!HasCollisionLoadedAroundEntity(ped) &&
      !!HasModelLoaded(boardModel) &&
      !!HasModelLoaded(overlayModel)
  );

  freezePlayer(playerId, false);

  // await delay(1000);

  const [x, y, z] = GetEntityCoords(ped, false);
  const board = CreateObject(boardModel, x, y, z, false, true, false);
  const overlay = CreateObject(overlayModel, x, y, z, false, true, false);

  AttachEntityToEntity(
    overlay,
    board,
    4103,
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

  SetModelAsNoLongerNeeded(boardModel);
  SetModelAsNoLongerNeeded(overlayModel);

  await delay(4500);

  if (IsScreenFadedOut()) {
    await waitFor(() => !IsScreenFadedOut());
    DoScreenFadeIn(2000);
  }

  const renderHandle = CreateNamedRenderTargetForModel("ID_Text", overlayModel);

  const [_, sequence] = OpenSequenceTask(0);
  TaskPlayAnimAdvanced(
    0,
    anim,
    "intro",
    spawn.x,
    spawn.y,
    spawn.z,
    0,
    0,
    -40,
    8.0,
    -8.0,
    -1,
    4608,
    0,
    2,
    0
  );
  TaskPlayAnim(0, anim, "loop", 8, -8, -1, 513, 1, false, false, false);
  CloseSequenceTask(sequence);
  ClearPedTasks(ped);
  ClearPedTasksImmediately(ped);
  TaskPerformSequence(ped, sequence);
  ClearSequenceTask(sequence);

  const zoomedOutCam = CreateCamWithParams(
    "DEFAULT_SCRIPTED_CAMERA",
    402.75,
    -1005,
    -98.6,
    0,
    0,
    0,
    36.97171,
    false,
    0
  );
  SetCamActive(zoomedOutCam, true);
  RenderScriptCams(true, false, 0, false, false);

  // const headerTextureKey = "commonmenu";
  // const sharedTextureKey = "shared";
  // RequestStreamedTextureDict(headerTextureKey, true);
  // RequestStreamedTextureDict(sharedTextureKey, true);
  // await waitFor(
  //   () =>
  //     !!HasStreamedTextureDictLoaded(headerTextureKey) &&
  //     !!HasStreamedTextureDictLoaded(sharedTextureKey)
  // );

  let i = 0;

  setTick(() => {
    HideHudAndRadarThisFrame();
    renderHandle &&
      drawMugshotBoard(
        renderHandle,
        boardScaleform,
        "Your Name",
        "TRANSFERRED",
        "0000532131",
        "LOS SANTOS POLICE DEPT",
        1
      );
  });

  RequestStreamedTextureDict("pause_menu_pages_char_mom_dad", true);
  RequestStreamedTextureDict("char_creator_portraits", true);

  await delay(250);
  const fullBodyCam = CreateCamWithParams(
    "DEFAULT_SCRIPTED_CAMERA",
    402.75,
    -1000.6,
    -98.6,
    -5,
    0,
    0,
    36.97171,
    false,
    0
  );
  ShakeCam(fullBodyCam, "HAND_SHAKE", 0.1);
  func_1636(fullBodyCam, 3.5, 0.33, 0.5, 1);
  SetCamActiveWithInterp(fullBodyCam, zoomedOutCam, 4400, 8, 8);

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

  while (GetSequenceProgress(ped) !== 1) {
    await delay(250);
  }

  await waitFor(
    () =>
      !!HasStreamedTextureDictLoaded("pause_menu_pages_char_mom_dad") &&
      !!HasStreamedTextureDictLoaded("char_creator_portraits")
  );

  setTick(() => {
    switch (state.route) {
      case "root": {
        if (IsControlJustPressed(0, Controls.FrontendAccept) && i == 1) {
          state.route = "heritage";
          i = 0;
          SetCamActiveWithInterp(faceCam, fullBodyCam, 800, 3, 8);
          TaskPlayAnim(
            ped,
            anim,
            "face",
            1,
            -1,
            -1,
            513,
            1,
            false,
            false,
            false
          );
        } else if (IsControlJustPressed(0, Controls.FrontendUp)) {
          i--;

          if (i == -1) i = 6 - 1;
        } else if (IsControlJustPressed(0, 187)) {
          /* Down */
          i++;

          if (i == 6) i = 0;
        } else if (
          state.route === "root" &&
          i === 0 &&
          (IsControlJustPressed(0, Controls.FrontendLeft) ||
            IsControlJustPressed(0, Controls.FrontendRight))
        ) {
          state.isMale = !state.isMale;

          (async function() {
            await waitFor(
              () =>
                GetPlayerPed(playerId) != -1 &&
                !!NetworkIsPlayerActive(playerId)
            );

            ped = GetPlayerPed(playerId);

            const model = GetHashKey(
              `mp_${state.isMale ? "m" : "f"}_freemode_01`
            );

            RequestModel(model);

            anim = `mp_character_creation@customise@${
              state.isMale ? "" : "fe"
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

            setToDefault();
            updateHeritage();
            SetModelAsNoLongerNeeded(model);
          })();
        }
        break;
      }
      case "heritage": {
        if (IsControlJustPressed(0, Controls.FrontendCancel)) {
          state.route = "root";
          i = 1;
          SetCamActiveWithInterp(fullBodyCam, faceCam, 800, 3, 8);
          TaskPlayAnim(
            ped,
            anim,
            "loop",
            1,
            -1,
            -1,
            513,
            1,
            false,
            false,
            false
          );
        } else if (IsControlJustPressed(0, Controls.FrontendUp)) {
          i--;

          if (i == -1) i = 4 - 1;
        } else if (IsControlJustPressed(0, Controls.FrontendDown)) {
          i++;

          if (i == 4) i = 0;
        } else if (IsControlJustPressed(0, Controls.FrontendLeft)) {
          switch (i) {
            case 0:
              state.mum--;
              if (state.mum === -1) state.mum = mums.length - 1;
              updateHeritage();
              break;
            case 1:
              state.dad--;
              if (state.dad === -1) state.dad = dads.length - 1;
              updateHeritage();
              break;
            case 2:
              if (state.shapeMix > 0) {
                state.shapeMix -= 0.01;
                updateHeritage();
              }
              break;
            case 3:
              if (state.skinMix > 0) {
                state.skinMix -= 0.01;
                updateHeritage();
              }
              break;
          }
        } else if (IsControlJustPressed(0, Controls.FrontendRight)) {
          switch (i) {
            case 0:
              state.mum++;
              if (state.mum === mums.length) state.mum = 0;
              updateHeritage();
              break;
            case 1:
              state.dad++;
              if (state.dad === dads.length) state.dad = 0;
              updateHeritage();
              break;
            case 2:
              if (state.shapeMix < 1) {
                state.shapeMix += 0.01;
                updateHeritage();
              }
              break;
            case 3:
              if (state.skinMix < 1) {
                state.skinMix += 0.01;
                updateHeritage();
              }
              break;
          }
        }
        break;
      }
    }

    drawMenu(
      state.route,
      i,
      state.isMale,
      state.mum,
      state.dad,
      state.shapeMix,
      state.skinMix
    )(246 / 1920, 46 / 1080);

    // DrawSprite(
    //   sharedTextureKey,
    //   "info_icon_32",
    //   x + w / 2 - 20 / 1920,
    //   92 / 1080 +
    //     headerHeight / 2 +
    //     itemHeight * 2 +
    //     mainBackgroundHeight +
    //     2 / 1080 +
    //     3 / 1080 +
    //     itemHeight / 2,
    //   32 / 1920,
    //   32 / 1080,
    //   0,
    //   255,
    //   255,
    //   255,
    //   255
    // );
  });
}

function main() {
  DoScreenFadeOut(0);
  ShutdownLoadingScreen();

  spawn();
}

setTimeout(main, 0);
