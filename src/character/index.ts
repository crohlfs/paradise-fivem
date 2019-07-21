// import memoizeOne from "memoize-one";
// import { drawItems, header, batch, rect, text, spacer, sprite } from "./ui";
// import Controls from "./constants/controls";
// import { mums, dads } from "../constants/parents";
// import { waitFor, noop, delay } from "../util";
import { addTick } from "../addTick";
import IntroScene from "./IntroScene";

addTick(HideHudAndRadarThisFrame);
IntroScene(true, 19, 12, 0.5, 0.5);
