'use strict';

import * as assert from 'assert';
import { generatePrivateKey } from '../src/privateKey';

describe('privateKey', () => {
  describe('generatePrivateKey', () => {
    it('should be able to create a private key', () => {
      const key = generatePrivateKey();
      assert(typeof key === 'string');
      assert((key as string).indexOf('-----BEGIN RSA PRIVATE KEY-----') === 0);
    });
  });
});
