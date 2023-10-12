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
      owner: publicKey('N4f6zftYsuu4yT7icsjLwh4i6pB1zvvKbseHj2NmSQw'),
      jsonUri:
        'https://arweave.net/c9aGs5fOk7gD4wWnSvmzeqgtfxAGRgtI1jYzvl8-IVs/chiaki-violet-azure-common.json',
    });

    // Then we expect to find an asset.
    t.true(assets.items.length == 1);

    // Then we expect the following data.
    t.like(assets.items[0], <DasApiAsset>{
      interface: 'V1_NFT',
      id: '8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV',
      content: {
        metadata: {
          name: 'Chiaki Azure 55',
          symbol: '',
        },
      },
      authorities: [
        {
          address: 'mRdta4rc2RtsxEUDYuvKLamMZAdW6qHcwuq866Skxxv',
          scopes: ['full'],
        },
      ],
      compression: {
        eligible: false,
        compressed: true,
        data_hash: '3daLaunnCdbLtYR4Gas4xFnKLVezdMNqgjZEXtzhWqFA',
        creator_hash: 'DJ7kGgdfHEMPJLUTW1YdnGX2JBc3DdD6ybJmkfE4wgSq',
        asset_hash: 'BtbdpcxueKdAwpwRtyXMpUMV2Zbjd6YYtWvyiAK2FNQ6',
        tree: '9PHhh7dJqdWnmjwiZEe6bMCFKnRSL436msEhN587adu5',
        seq: 540278,
        leaf_id: 539880,
      },
      grouping: [
        {
          group_key: 'collection',
          group_value: 'PEEiTQbMc87HQ9TbXfHWWyW3bKiMExbGmAiMDR6NUiD',
        },
      ],
      royalty: {
        royalty_model: 'creators',
        target: null,
        percent: 0.030000000000000002,
        basis_points: 300,
        primary_sale_happened: false,
        locked: false,
      },
    });
  });
});

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can search a compressed asset by collection (${endpoint.name})`, async (t) => {
    // Given a DAS API endpoint.
    const umi = createUmi(endpoint.url);

    // When we search for assetw given their collection.
    const assets = await umi.rpc.searchAssets({
      grouping: ['collection', 'PEEiTQbMc87HQ9TbXfHWWyW3bKiMExbGmAiMDR6NUiD'],
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the collection should match.
    assets.items.forEach((asset) => {
      t.like(assets.items[0], <DasApiAsset>{
        grouping: [
          {
            group_key: 'collection',
            group_value: 'PEEiTQbMc87HQ9TbXfHWWyW3bKiMExbGmAiMDR6NUiD',
          },
        ],
      });
    });
  });
});
