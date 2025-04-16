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
    const assetId = publicKey('DNzerLDcC5apcAQQ2Wx3qfRK1NPP6g5Bsg11fPpWkRtA');

    // When we fetch the asset using its ID.
    const asset = await umi.rpc.getAsset(assetId);

    // Then we expect the following data.
    t.deepEqual(asset.interface, 'V1_NFT');
    t.deepEqual(asset.id, assetId);
    t.like(asset.content, <DasApiAssetContent>{
      json_uri: 'https://example.com/my-nft.json',
      metadata: {
        name: 'My NFT',
      },
    });
    t.deepEqual(asset.compression, <DasApiAssetCompression>{
      eligible: false,
      compressed: true,
      data_hash: '2YDXnkcksCo3RZdVFJC8oq1CMQoYFgN6TMWnkffFrHAM',
      creator_hash: 'EKDHSGbrGztomDfuiV4iqiZ6LschDJPsFiXjZ83f92Md',
      asset_hash: '8KPK2EQ7g3edRv4au36fRNwFPcfAvP3HnH2VFqsBQje7',
      tree: 'Hw2qE4TKe8rt3VGWupLEH7wZtTrbBAzuU7LWBXfhGNMJ',
      seq: 1,
      leaf_id: 0,
    });
    t.deepEqual(asset.grouping.length, 1);
    t.like(asset.grouping[0], {
      group_key: 'collection',
      group_value: '3KPARzW2CoGhFYMKbxjGuGQfF3w2o9shnnjKZmCHCjBU',
    });
    t.deepEqual(asset.mutable, true);
    t.deepEqual(asset.burnt, false);
  });

  test(`it can fetch a regular asset by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('EvGJtxZAjxYGwYDtHprvApfLTx44PxsSCtWq3uVmfboy');

    // When we fetch the asset using its ID.
    const asset = await umi.rpc.getAsset(assetId);

    // Then we expect the following data.
    t.like(asset, <DasApiAsset>{
      interface: 'V1_NFT',
      id: assetId,
      content: {
        metadata: {
          name: 'THUG #2926',
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
    const assetId = publicKey('DSDRbKDyCVH3EhghB3djTCM1Ktj4Vbk6cXrPnMCbPXqs');

    // When we fetch the asset using its ID with display options.
    const asset = await umi.rpc.getAsset({
      assetId,
      displayOptions: { showUnverifiedCollections: false },
    });
    
    t.like(asset, <DasApiAsset>{
      interface: 'V1_NFT',
      id: assetId,
      content: {
        metadata: {
          name: 'SMB #3964',
        },
      },
    });
    t.is(asset.grouping.length, 0);
  });

  test(`it can fetch a regular asset by ID with unverified collection data using showUnverifiedCollections true (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('DSDRbKDyCVH3EhghB3djTCM1Ktj4Vbk6cXrPnMCbPXqs');

    // When we fetch the asset using its ID.
    const asset = await umi.rpc.getAsset({
      assetId,
      displayOptions: { showUnverifiedCollections: true },
    });

    t.like(asset, <DasApiAsset>{
      interface: 'V1_NFT',
      id: assetId,
      content: {
        metadata: {
          name: 'SMB #3964',
        },
      },
    });
    t.is(asset.grouping.length, 1);
    t.like(asset.grouping[0], {
      group_key: 'collection',
      group_value: 'SMBtHCCC6RYRutFEPb4gZqeBLUZbMNhRKaMKZZLHi7W',
      verified: false,
    });
  });
});
