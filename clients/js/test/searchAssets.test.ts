import test from 'ava';
import { DasApiAsset } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';
import { publicKey } from '@metaplex-foundation/umi';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can search a compressed asset by owner (${endpoint.name})`, async (t) => {
    // increase test timeout
    t.timeout(40_000);

    // Given a DAS API endpoint.
    const umi = createUmi(endpoint.url);

    // When we search for an asset given its owner.
    const assets = await umi.rpc.searchAssets({
      owner: publicKey('9Qo4631XNdLYVUw1S1iBhDmu1DtcPwHqrg5ZjPbzUqGQ'),
      compressed: true,
      jsonUri: 'https://example.com/my-nft.json',
    });

    // Then we expect to find an asset.
    t.true(assets.items.length >= 1);

    // Then we expect the following data.
    t.like(assets.items[0], <DasApiAsset>{
      interface: 'V1_NFT',
      id: 'DNzerLDcC5apcAQQ2Wx3qfRK1NPP6g5Bsg11fPpWkRtA',
      content: {
        metadata: {
          name: 'My NFT',
          symbol: '',
        },
      },
      authorities: [
        {
          address: '8dFibVsqyHR7FXAwMuvkLMj86Xa6TAg6X1NsmHbJHTio',
          scopes: ['full'],
        },
      ],
      compression: {
        eligible: false,
        compressed: true,
        data_hash: '2YDXnkcksCo3RZdVFJC8oq1CMQoYFgN6TMWnkffFrHAM',
        creator_hash: 'EKDHSGbrGztomDfuiV4iqiZ6LschDJPsFiXjZ83f92Md',
        asset_hash: '8KPK2EQ7g3edRv4au36fRNwFPcfAvP3HnH2VFqsBQje7',
        tree: 'Hw2qE4TKe8rt3VGWupLEH7wZtTrbBAzuU7LWBXfhGNMJ',
        seq: 1,
        leaf_id: 0,
      },
      grouping: [
        {
          group_key: 'collection',
          group_value: '3KPARzW2CoGhFYMKbxjGuGQfF3w2o9shnnjKZmCHCjBU',
        },
      ],
      royalty: {
        royalty_model: 'creators',
        target: null,
        percent: 0.055,
        basis_points: 550,
        primary_sale_happened: false,
        locked: false,
      },
    });
  });

  test(`it can search a compressed asset by collection (${endpoint.name})`, async (t) => {
    // Given a DAS API endpoint.
    const umi = createUmi(endpoint.url);

    // When we search for assets given their collection.
    const assets = await umi.rpc.searchAssets({
      grouping: ['collection', '3KPARzW2CoGhFYMKbxjGuGQfF3w2o9shnnjKZmCHCjBU'],
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the collection should match.
    assets.items.forEach((asset) => {
      t.like(assets.items[0], <DasApiAsset>{
        grouping: [
          {
            group_key: 'collection',
            group_value: '3KPARzW2CoGhFYMKbxjGuGQfF3w2o9shnnjKZmCHCjBU',
          },
        ],
      });
    });
  });

  test(`it can search assets with showUnverifiedCollections true (${endpoint.name})`, async (t) => {
    // Given a DAS API endpoint.
    const umi = createUmi(endpoint.url);

    // When we search for assets with display options.
    const assets = await umi.rpc.searchAssets({
      owner: publicKey('3p1hnJ5ffeDamjAeBRReBdVfnef3jd19wBiTSLd3ikDE'),
      displayOptions: {
        showUnverifiedCollections: true,
      },
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // Find the specific asset
    const specificAsset = assets.items.find(
      (asset) => asset.id === '6gzjJWsqaPM37HyrTHxVCoysZiGA757ixwap4dY3pxh5'
    );

    // Assert the asset exists and has group_definition
    t.truthy(specificAsset, 'Expected to find the specific asset');
    if (specificAsset) {
      t.is(
        (specificAsset as any).group_definition,
        undefined,
        'Expected group_definition to be undefined when showUnverifiedCollections is true'
      );
    }
  });

  test(`it can search assets with showUnverifiedCollections false (${endpoint.name})`, async (t) => {
    // Given a DAS API endpoint.
    const umi = createUmi(endpoint.url);

    // When we search for assets with display options.
    const assets = await umi.rpc.searchAssets({
      owner: publicKey('3p1hnJ5ffeDamjAeBRReBdVfnef3jd19wBiTSLd3ikDE'),
      displayOptions: {
        showUnverifiedCollections: false,
      },
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // But not the specific asset which is not a verified part of a collection
    const specificAsset = assets.items.find(
      (asset) => asset.id === '6gzjJWsqaPM37HyrTHxVCoysZiGA757ixwap4dY3pxh5'
    );

    t.truthy(specificAsset, 'Expected to find the specific asset');
    t.is(
      specificAsset?.grouping.length,
      0,
      'Expected grouping array to be empty'
    );
  });
});
