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

  test(`it can fetch assets by owner with showCollectionMetadata true (${endpoint.name})`, async (t) => {
    // Given an owner address.
    const umi = createUmi(endpoint.url);
    const owner = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

    // When we fetch the asset using the owner with display options.
    const assets = await umi.rpc.getAssetsByOwner({
      owner,
      displayOptions: {
        showCollectionMetadata: true,
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

    // And collection metadata should be present in the grouping for assets that have collections
    const assetWithCollection = assets.items.find((asset) =>
      asset.grouping?.some((group) => group.group_key === 'collection')
    );
    t.truthy(assetWithCollection, 'Expected to find at least one asset with a collection');

    const collectionGroup = assetWithCollection!.grouping.find(
      (group) => group.group_key === 'collection'
    );
    t.truthy(collectionGroup, 'Expected to find a collection group');
    t.like(collectionGroup, {
      group_key: 'collection',
      group_value: 'Dm1TRVw82roqpfqpzsFxSsWg6a4z3dku6ebVHSHuVo1c',
      collection_metadata: {
        name: 'My cNFT Collection',
        symbol: '',
        image: 'https://gateway.irys.xyz/8da3Er9Q39QRkdNhBNP7w5hDo5ZnydLNxLqe9i6s1Nak',
        description: '',
        external_url: ''
      }
    });
  });
});
