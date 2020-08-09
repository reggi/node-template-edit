#!/usr/bin/env node
import {Generate} from './mod';

(async () => {
  await Generate.cli(process);
})();
