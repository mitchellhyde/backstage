/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import express from 'express';
import Router from 'express-promise-router';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { Logger } from 'winston';
import { providers } from './../providers/config';
import { createAuthProviderRouter } from '../providers';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  const logger = options.logger.child({ plugin: 'auth' });

  router.use(cookieParser());
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  // configure all the providers
  for (const providerConfig of providers) {
    const { provider } = providerConfig;
    const providerRouter = createAuthProviderRouter(providerConfig);
    logger.info(`Configuring provider, ${provider}`);
    router.use(`/${provider}`, providerRouter);
  }

  return router;
}
