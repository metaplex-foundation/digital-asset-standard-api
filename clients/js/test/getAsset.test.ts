import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import {
  DasApiAsset,
  DasApiAssetCompression,
  DasApiAssetContent,
} from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch a compressed asset by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA');

    // When we fetch the asset using its ID.
    const asset = await umi.rpc.getAsset(assetId);

    // Then we expect the following data.
    t.deepEqual(asset.interface, 'V1_NFT');
    t.deepEqual(asset.id, assetId);
    t.like(asset.content, <DasApiAssetContent>{
      json_uri:
        'https://arweave.net/c9aGs5fOk7gD4wWnSvmzeqgtfxAGRgtI1jYzvl8-IVs/chiaki-violet-azure-common.json',
      metadata: {
        name: 'Chiaki Azure 55',
      },
    });
    t.deepEqual(asset.compression, <DasApiAssetCompression>{
      eligible: false,
      compressed: true,
      data_hash: '29BdgNWxNB1sinkfmWKFQi3zWXRpsotp2FKoZhoqVa9F',
      creator_hash: 'FGAvkyrzeEgvGGMfmi6ztGpvybHMYAL9w82nx6wzLVqn',
      asset_hash: 'FGWfA5v5SZnpe9r32NEvDyX9hLeVEoBf3GqEkHX6YK9w',
      tree: 'J1imb8C8SPzofrtgCxkN4nsKwHevzxgvHGeYBKFEDEmE',
      seq: 1,
      leaf_id: 0,
    });
    t.deepEqual(asset.grouping.length, 1);
    t.like(asset.grouping[0], {
      group_key: 'collection',
      group_value: 'Dm1TRVw82roqpfqpzsFxSsWg6a4z3dku6ebVHSHuVo1c',
    });
    t.deepEqual(asset.mutable, true);
    t.deepEqual(asset.burnt, false);
  });

  test(`it can fetch a regular asset by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('Hu9vvgNjVDxRo6F8iTEo6sRJikhqoM2zVswR86WAf4C');

    // When we fetch the asset using its ID.
    const asset = await umi.rpc.getAsset(assetId);

    // Then we expect the following data.
    t.like(asset, <DasApiAsset>{
      interface: 'V1_NFT',
      id: assetId,
      content: {
        metadata: {
          name: 'Chiaki Azure 55',
        },
      },
    });
    t.like(asset.compression, <DasApiAssetCompression>{
      compressed: false,
    });
    t.deepEqual(asset.mutable, true);
    t.deepEqual(asset.burnt, false);
  });

  test(`it can fetch a regular asset by ID not showing unverified collection data using showUnverifiedCollections false (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('5smGnzgaMsQ3JV7jWCvSxnRkHjP2dJoi1uczHTx87tji');

    // When we fetch the asset using its ID with display options.
    await t.throwsAsync(async () => {
      await umi.rpc.getAsset({
        assetId,
        options: { showUnverifiedCollections: false },
      });
    }, {
      message: /Asset not found/
    });
  });

  test(`it can fetch a regular asset by ID with unverified collection data using showUnverifiedCollections true (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('5smGnzgaMsQ3JV7jWCvSxnRkHjP2dJoi1uczHTx87tji');

    // When we fetch the asset using its ID.
    const asset = await umi.rpc.getAsset({
      assetId,
      options: { showUnverifiedCollections: true },
    });

    t.like(asset, <DasApiAsset>{
      interface: 'V1_NFT',
      id: assetId,
      content: {
        metadata: {
          name: 'unverified Azure 55',
        },
      },
    });
    t.is(asset.grouping.length, 1);
    t.like(asset.grouping[0], {
      group_key: 'collection',
      group_value: '5g2h8NuNNdb2riSuAKC3JJrrJKGJUH9dxM23fqdYgGt2',
      verified: false,
    });
  });
});
