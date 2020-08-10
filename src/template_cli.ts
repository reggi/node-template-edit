#!/usr/bin/env node
import {Template} from './template';

(async () => {
  await Template.cli(process);
})();
