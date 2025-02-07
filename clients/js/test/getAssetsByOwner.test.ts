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

  test(`it can fetch compressed assets by owner with showUnverifiedCollections true (${endpoint.name})`, async (t) => {
    // Given an owner address.
    const umi = createUmi(endpoint.url);
    const owner = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

    // When we fetch the asset using the owner with display options.
    const assets = await umi.rpc.getAssetsByOwner({
      owner,
      displayOptions: {
        showUnverifiedCollections: true,
      },
    });

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
    // And at least one asset should have an unverified collection
    const assetWithUnverifiedCollection = assets.items.find((asset) =>
      asset.grouping?.some((group) => group.verified === false)
    );
    t.truthy(
      assetWithUnverifiedCollection,
      'Expected to find at least one asset with an unverified collection'
    );
  });
});
