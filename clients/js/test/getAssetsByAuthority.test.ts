import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch compressed assets by authority (${endpoint.name})`, async (t) => {
    // Given an authority address.
    const umi = createUmi(endpoint.url);
    const authority = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

    // When we fetch the asset using the authority.
    const assets = await umi.rpc.getAssetsByAuthority({ authority });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the authority should be present.
    assets.items.forEach((asset) => {
      t.true(asset.authorities.some((other) => other.address === authority));
    });
  });
});
