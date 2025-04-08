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
    const owner = publicKey('DAS7Wnf86QNmwKWacTe8KShU7V6iw7wwcPjG9qXLPkEU');

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
    const targetCollectionValue = 'Ce9hnNkbwNP7URw6TkhpopcKeNm8s4SchbBJS3m8tTu2';
    const assetWithCollection = assets.items.find((asset) =>
      asset.grouping?.some((group) => group.group_key === 'collection' && group.group_value === targetCollectionValue)
    );
    t.truthy(
      assetWithCollection,
      'Expected to find at least one asset with a collection'
    );

    const collectionGrouping = assetWithCollection?.grouping?.find(
      g => g.group_key === 'collection' && g.group_value === targetCollectionValue
    );
    t.truthy(collectionGrouping, 'Expected to find the specific collection grouping');
    t.like(collectionGrouping, {
      group_key: 'collection',
      group_value: targetCollectionValue,
      collection_metadata: collectionGrouping?.collection_metadata
    });
  });

  test(`it can fetch assets by owner with showFungible true (${endpoint.name})`, async (t) => {
    // Given an owner address.
    const umi = createUmi(endpoint.url);
    const owner = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

    // When we fetch the asset using the owner with display options.
    const assets = await umi.rpc.getAssetsByOwner({
      owner,
      displayOptions: {
        showFungible: true,
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

    // And at least one asset should be a fungible token
    const fungibleAsset = assets.items.find(
      (asset) => asset.interface === 'FungibleToken'
    );
    t.truthy(
      fungibleAsset,
      'Expected to find at least one fungible token asset'
    );
  });

  test(`it can fetch assets by owner with showFungible false (${endpoint.name})`, async (t) => {
    // Given an owner address.
    const umi = createUmi(endpoint.url);
    const owner = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

    // When we fetch the asset using the owner with display options.
    const assets = await umi.rpc.getAssetsByOwner({
      owner,
      displayOptions: {
        showFungible: false,
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

    // And no asset should be a fungible token
    const fungibleAsset = assets.items.find(
      (asset) => asset.interface === 'FungibleToken'
    );
    t.falsy(fungibleAsset, 'Expected not to find any fungible token assets');
  });
});
