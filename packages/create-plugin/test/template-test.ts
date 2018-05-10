'use strict';

import * as assert from 'assert';
import { filter } from 'minimatch';
import {
  filterTemplateFile,
  getDepsByTemplateType,
  getTemplateType
} from '../src/template';
import createBaseManifest from './baseManifest';

describe('template', () => {
  describe('getTemplateType', () => {
    it('should return be mimimum', () => {
      assert.equal(getTemplateType(createBaseManifest()), 'minimum');
    });
  });
  describe('getDepsByTemplateType', () => {
    it('should returns dependencies and devDependencies', () => {
      const deps = getDepsByTemplateType(getTemplateType(createBaseManifest()));
      assert(Array.isArray(deps.dependencies));
      assert(Array.isArray(deps.devDependencies));
      assert(deps.devDependencies[0] === '@kintone/plugin-packer');
    });
  });
  describe('filterTemplateFile', () => {
    it('should returns a boolean that shows whether the file should include or not', () => {
      const manifest = createBaseManifest();
      assert(filterTemplateFile(manifest, 'js/mobile.js') === false);
      assert(filterTemplateFile(manifest, 'js/config.js') === false);
      assert(filterTemplateFile(manifest, 'js/other.js') === true);
      assert(
        filterTemplateFile({ ...manifest, mobile: {} }, 'js/mobile.js') === true
      );
      assert(
        filterTemplateFile({ ...manifest, config: {} }, 'js/config.js') === true
      );
    });
  });
});
