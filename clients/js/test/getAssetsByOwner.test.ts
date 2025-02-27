import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';
import { DasApiAsset } from '../src';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch compressed assets by owner (${endpoint.name})`, async (t) => {
    // Given an owner address.
    const umi = createUmi(endpoint.url);
    const owner = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

    // When we fetch the asset using the owner.
    const assets = await umi.rpc.getAssetsByOwner({ owner });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the owner should match.
    assets.items.forEach((asset) => {
      t.like(assets.items[0], <DasApiAsset>{
        ownership: {
          owner,
        },
      });
    });
  });
});
