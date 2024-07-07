import fs from 'fs';
import path from 'path';
import { logger } from '$utils/business/logger';
import type { Context } from './context';

export interface BoilerplateConfig {
  /** All variables that may be injected */
  variables: string[];
  /** `inject` function is a hook that will run before filling boilerplate with variables */
  inject(ctx: Context): Record<string, any>;
}

export function getBoilerplateConfig(boilerplatePath: string): BoilerplateConfig | undefined {
  const configPath = path.join(boilerplatePath, 'boilr.config.cjs');
  logger.info('try find config file at', configPath);
  if (fs.existsSync(configPath) && fs.statSync(configPath).isFile()) {
    try {
      const config = require(configPath) as BoilerplateConfig;
      if (config && typeof config.inject === 'function' && Array.isArray(config.variables)) {
        logger.info('config loaded:', configPath);
        return config;
      }
    } catch (ex) {
      logger.error(ex);
    }
  }

  return undefined;
}
