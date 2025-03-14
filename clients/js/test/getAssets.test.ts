import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DasApiAssetCompression, DasApiAssetContent } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch multiple assets by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const compressedAssetId = publicKey(
      'GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA'
    );
    const regularAssetId = publicKey(
      '8bFQbnBrzeiYQabEJ1ghy5T7uFpqFzPjUGsVi3SzSMHB'
    );

    // When we fetch the asset using its ID.
    const assets = await umi.rpc.getAssets([compressedAssetId, regularAssetId]);

    // Then we expect the following data.
    t.deepEqual(assets[0].interface, 'V1_NFT');
    t.deepEqual(assets[0].id, compressedAssetId);
    t.like(assets[0].content, <DasApiAssetContent>{
      json_uri:
        'https://arweave.net/c9aGs5fOk7gD4wWnSvmzeqgtfxAGRgtI1jYzvl8-IVs/chiaki-violet-azure-common.json',
      metadata: {
        name: 'Chiaki Azure 55',
      },
    });
    t.deepEqual(assets[0].compression, <DasApiAssetCompression>{
      eligible: false,
      compressed: true,
      data_hash: '29BdgNWxNB1sinkfmWKFQi3zWXRpsotp2FKoZhoqVa9F',
      creator_hash: 'FGAvkyrzeEgvGGMfmi6ztGpvybHMYAL9w82nx6wzLVqn',
      asset_hash: 'FGWfA5v5SZnpe9r32NEvDyX9hLeVEoBf3GqEkHX6YK9w',
      tree: 'J1imb8C8SPzofrtgCxkN4nsKwHevzxgvHGeYBKFEDEmE',
      seq: 1,
      leaf_id: 0,
    });
    t.deepEqual(assets[0].grouping.length, 1);
    t.like(assets[0].grouping[0], {
      group_key: 'collection',
      group_value: 'Dm1TRVw82roqpfqpzsFxSsWg6a4z3dku6ebVHSHuVo1c',
    });
    t.deepEqual(assets[0].mutable, true);
    t.deepEqual(assets[0].burnt, false);

    t.deepEqual(assets[1].interface, 'ProgrammableNFT');
    t.deepEqual(assets[1].id, regularAssetId);
    t.like(assets[1].content, <DasApiAssetContent>{
      metadata: {
        name: 'Chiaki Azure 55',
      },
    });
    t.like(assets[1].compression, <DasApiAssetCompression>{
      compressed: false,
    });
    t.deepEqual(assets[1].grouping.length, 1);
    t.like(assets[1].grouping[0], {
      group_key: 'collection',
      group_value: '5RT4e9uHUgG9h13cSc3L4YvkDc9qXSznoLaX4Tx8cpWS',
    });
    t.deepEqual(assets[1].mutable, true);
    t.deepEqual(assets[1].burnt, false);
  });
});
