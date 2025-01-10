import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DasApiAsset, DasApiAssetCompression, DasApiAssetContent } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch a compressed asset by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV');

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
      data_hash: '3daLaunnCdbLtYR4Gas4xFnKLVezdMNqgjZEXtzhWqFA',
      creator_hash: 'DJ7kGgdfHEMPJLUTW1YdnGX2JBc3DdD6ybJmkfE4wgSq',
      asset_hash: 'BtbdpcxueKdAwpwRtyXMpUMV2Zbjd6YYtWvyiAK2FNQ6',
      tree: '9PHhh7dJqdWnmjwiZEe6bMCFKnRSL436msEhN587adu5',
      seq: 540278,
      leaf_id: 539880,
    });
    t.deepEqual(asset.grouping.length, 1);
    t.like(asset.grouping[0], {
      group_key: 'collection',
      group_value: 'PEEiTQbMc87HQ9TbXfHWWyW3bKiMExbGmAiMDR6NUiD',
    });
    t.deepEqual(asset.mutable, true);
    t.deepEqual(asset.burnt, false);
  });

  test(`it can fetch a regular asset by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('5ja3EvVuEu5rXgtYE3LXKG84s7Pmy5siFfYbcopMc2Dx');

    // When we fetch the asset using its ID.
    const asset = await umi.rpc.getAsset(assetId);

    // Then we expect the following data.
    t.like(asset, <DasApiAsset>{
      interface: 'ProgrammableNFT',
      id: assetId,
      content: {
        metadata: {
          name: 'Mad Lads #2732',
        },
      },
    });
    t.like(asset.compression, <DasApiAssetCompression>{
      compressed: false,
    });
    t.deepEqual(asset.grouping.length, 1);
    t.like(asset.grouping[0], {
      group_key: 'collection',
      group_value: 'J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w',
    });
    t.deepEqual(asset.mutable, true);
    t.deepEqual(asset.burnt, false);
  });
});
