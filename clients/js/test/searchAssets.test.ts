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
      owner: publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz'),
      compressed: true,
      jsonUri:
        'https://arweave.net/c9aGs5fOk7gD4wWnSvmzeqgtfxAGRgtI1jYzvl8-IVs/chiaki-violet-azure-common.json',
    });

    // Then we expect to find an asset.
    t.true(assets.items.length > 1);

    // Then we expect the following data.
    t.like(assets.items[0], <DasApiAsset>{
      interface: 'V1_NFT',
      id: 'GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA',
      content: {
        metadata: {
          name: 'Chiaki Azure 55',
          symbol: '',
        },
      },
      authorities: [
        {
          address: '6FpirDzk8dXDfSHWH7FAjKSvjtMPbTBYe34bRckeRN2u',
          scopes: ['full'],
        },
      ],
      compression: {
        eligible: false,
        compressed: true,
        data_hash: '29BdgNWxNB1sinkfmWKFQi3zWXRpsotp2FKoZhoqVa9F',
        creator_hash: 'FGAvkyrzeEgvGGMfmi6ztGpvybHMYAL9w82nx6wzLVqn',
        asset_hash: 'FGWfA5v5SZnpe9r32NEvDyX9hLeVEoBf3GqEkHX6YK9w',
        tree: 'J1imb8C8SPzofrtgCxkN4nsKwHevzxgvHGeYBKFEDEmE',
        seq: 1,
        leaf_id: 0,
      },
      grouping: [
        {
          group_key: 'collection',
          group_value: 'Dm1TRVw82roqpfqpzsFxSsWg6a4z3dku6ebVHSHuVo1c',
        },
      ],
      royalty: {
        royalty_model: 'creators',
        target: null,
        percent: 0.05,
        basis_points: 500,
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
      grouping: ['collection', 'Dm1TRVw82roqpfqpzsFxSsWg6a4z3dku6ebVHSHuVo1c'],
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the collection should match.
    assets.items.forEach((asset) => {
      t.like(assets.items[0], <DasApiAsset>{
        grouping: [
          {
            group_key: 'collection',
            group_value: 'Dm1TRVw82roqpfqpzsFxSsWg6a4z3dku6ebVHSHuVo1c',
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
      owner: publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz'),
      displayOptions: {
        showUnverifiedCollections: true,
      },
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // Find the specific asset
    const specificAsset = assets.items.find(
      (asset) => asset.id === 'JDforNYS5Bop4VdZyGCjcUyy1mYZKR4eDveqjZnRYXzy'
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
      owner: publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz'),
      displayOptions: {
        showUnverifiedCollections: false,
      },
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // Find the specific asset
    const specificAsset = assets.items.find(
      (asset) => asset.id === 'JDforNYS5Bop4VdZyGCjcUyy1mYZKR4eDveqjZnRYXzy'
    );
    
    // Assert the asset exists and does not have group_definition
    t.truthy(specificAsset, 'Expected to find the specific asset');
    if (specificAsset) {
      t.false(
        'group_definition' in specificAsset,
        'Expected not to find group_definition field in the specific asset when showUnverifiedCollections is false'
      );
    }
  });
});
