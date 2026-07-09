import type { Router } from "express";

export interface FeatureModule {
  readonly router: Router;
}
