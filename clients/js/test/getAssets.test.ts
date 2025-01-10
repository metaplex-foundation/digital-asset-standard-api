import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DasApiAssetCompression, DasApiAssetContent } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch multiple assets by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const compressedAssetId = publicKey(
      '8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV'
    );
    const regularAssetId = publicKey(
      '5ja3EvVuEu5rXgtYE3LXKG84s7Pmy5siFfYbcopMc2Dx'
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
      data_hash: '3daLaunnCdbLtYR4Gas4xFnKLVezdMNqgjZEXtzhWqFA',
      creator_hash: 'DJ7kGgdfHEMPJLUTW1YdnGX2JBc3DdD6ybJmkfE4wgSq',
      asset_hash: 'BtbdpcxueKdAwpwRtyXMpUMV2Zbjd6YYtWvyiAK2FNQ6',
      tree: '9PHhh7dJqdWnmjwiZEe6bMCFKnRSL436msEhN587adu5',
      seq: 540278,
      leaf_id: 539880,
    });
    t.deepEqual(assets[0].grouping.length, 1);
    t.like(assets[0].grouping[0], {
      group_key: 'collection',
      group_value: 'PEEiTQbMc87HQ9TbXfHWWyW3bKiMExbGmAiMDR6NUiD',
    });
    t.deepEqual(assets[0].mutable, true);
    t.deepEqual(assets[0].burnt, false);

    t.deepEqual(assets[1].interface, 'ProgrammableNFT');
    t.deepEqual(assets[1].id, regularAssetId);
    t.like(assets[1].content, <DasApiAssetContent>{
      metadata: {
        name: 'Mad Lads #2732',
      },
    });
    t.like(assets[1].compression, <DasApiAssetCompression>{
      compressed: false,
    });
    t.deepEqual(assets[1].grouping.length, 1);
    t.like(assets[1].grouping[0], {
      group_key: 'collection',
      group_value: 'J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w',
    });
    t.deepEqual(assets[1].mutable, true);
    t.deepEqual(assets[1].burnt, false);
  });
});
