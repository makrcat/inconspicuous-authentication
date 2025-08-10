import type { Engine, World } from "matter-js";

declare global {
  interface Window {
    engine: Engine;
    world: World;
  }
}

export {};