import { waitFor, delay, getLabel } from "../util";
import { addTick } from "../addTick";
import MainMenuScene from "./MainMenuScene";
import {
  setToDefault,
  updateHeritage,
  func_1636,
  updateFeatures
} from "./shared";
import HeadOverlays from "../constants/headOverlays";

export default async function(
  isMale: boolean,
  mum: number,
  dad: number,
  shapeMix: number,
  skinMix: number
) {
  const fastMode = !GetIsLoadingScreenActive();

  DoScreenFadeOut(0);
  ShutdownLoadingScreen();

  const playerId = PlayerId();
  await waitFor(
    () => GetPlayerPed(playerId) != -1 && !!NetworkIsPlayerActive(playerId)
  );

  let ped = GetPlayerPed(playerId);
  SetEntityVisible(ped, false, false);
  SetPlayerVisibleLocally(playerId, false);
  FreezeEntityPosition(ped, true);

  const model = GetHashKey(`mp_${isMale ? "m" : "f"}_freemode_01`);

  RequestModel(model);

  const boardScaleform = RequestScaleformMovie("mugshot_board_01");
  let anim = `mp_character_creation@customise@${isMale ? "" : "fe"}male_a`;
  RequestAnimDict(anim);

  RequestScriptAudioBank("DLC_GTAO/MUGSHOT_ROOM", false);
  RequestScriptAudioBank("Mugshot_Character_Creator", false);

  await waitFor(
    () =>
      !!HasScaleformMovieLoaded(boardScaleform) &&
      !!HasAnimDictLoaded(anim) &&
      !!HasModelLoaded(model)
  );

  await delay(fastMode ? 100 : 1000);

  freezePlayer(playerId, true);

  SetPlayerModel(playerId, model);
  ped = GetPlayerPed(playerId);

  SetModelAsNoLongerNeeded(model);

  const spawn = {
    x: 404.81,
    y: -997.76,
    z: -98.859
  };
  RequestCollisionAtCoord(spawn.x, spawn.y, spawn.z);

  SetEntityCoordsNoOffset(ped, spawn.x, spawn.y, spawn.z, true, true, true);
  SetEntityVisible(ped, true, false);
  FreezeEntityPosition(ped, false);

  setToDefault(ped);
  updateHeritage(isMale, ped, mum, dad, shapeMix, skinMix);
  updateFeatures(ped);

  const boardModel = GetHashKey("prop_police_id_board");
  const overlayModel = GetHashKey("prop_police_id_text");

  RequestStreamedTextureDict("pause_menu_pages_char_mom_dad", true);
  RequestStreamedTextureDict("char_creator_portraits", true);

  await waitFor(
    () =>
      !!HasCollisionLoadedAroundEntity(ped) &&
      !!HasModelLoaded(boardModel) &&
      !!HasModelLoaded(overlayModel) &&
      !!HasStreamedTextureDictLoaded("pause_menu_pages_char_mom_dad") &&
      !!HasStreamedTextureDictLoaded("char_creator_portraits")
  );

  freezePlayer(playerId, false);

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

  await delay(fastMode ? 100 : 4500);

  if (IsScreenFadedOut()) {
    await waitFor(() => !IsScreenFadedOut());
    DoScreenFadeIn(fastMode ? 0 : 2000);
  }

  const renderHandle = CreateNamedRenderTargetForModel("ID_Text", overlayModel);

  addTick(
    () =>
      renderHandle &&
      drawMugshotBoard(
        renderHandle,
        boardScaleform,
        "Your Name",
        "TRANSFERRED",
        "0000532131",
        getLabel("FACE_B_POL"),
        1
      )
  );

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
    fastMode ? 1 : -1,
    4608,
    fastMode ? 1 : 0,
    2,
    0
  );
  TaskPlayAnim(0, anim, "loop", 8, -8, -1, 513, 1, false, false, false);
  CloseSequenceTask(sequence);
  ClearPedTasks(ped);
  ClearPedTasksImmediately(ped);
  TaskPerformSequence(ped, sequence);
  ClearSequenceTask(sequence);

  await delay(fastMode ? 50 : 250);

  const [camFrom, camTo] = makeCameras();
  SetCamActiveWithInterp(camTo, camFrom, fastMode ? 100 : 6000, 8, 8);

  while (GetSequenceProgress(ped) !== 1) {
    await delay(250);
  }
  await MainMenuScene(camTo, isMale, mum, dad, shapeMix, skinMix, board, 0);
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

function makeCameras() {
  const camFrom = CreateCamWithParams(
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
  SetCamActive(camFrom, true);
  RenderScriptCams(true, false, 0, false, false);

  const camTo = CreateCamWithParams(
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
  ShakeCam(camTo, "HAND_SHAKE", 0.1);
  func_1636(camTo, 3.5, 0.33, 0.5, 1);

  return [camFrom, camTo];
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
