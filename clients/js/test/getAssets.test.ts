import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DasApiAssetCompression, DasApiAssetContent } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch multiple assets by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const compressedAssetId = publicKey(
      'DNzerLDcC5apcAQQ2Wx3qfRK1NPP6g5Bsg11fPpWkRtA'
    );
    const regularAssetId = publicKey(
      'G3nEdTzAvPvSuj2Z5oSSiMN42NayQDZvkC3usMrnGaTi'
    );

    // When we fetch the asset using its ID.
    const assets = await umi.rpc.getAssets([compressedAssetId, regularAssetId]);

    // Then we expect the following data.
    const compressedAsset = assets.find(
      (asset) => asset.id === compressedAssetId
    );
    const regularAsset = assets.find((asset) => asset.id === regularAssetId);

    t.truthy(compressedAsset, 'Expected to find compressed asset');
    t.truthy(regularAsset, 'Expected to find regular asset');

    // Compressed asset assertions
    t.deepEqual(compressedAsset!.interface, 'V1_NFT');
    t.deepEqual(compressedAsset!.id, compressedAssetId);
    t.like(compressedAsset!.content, <DasApiAssetContent>{
      json_uri: 'https://example.com/my-nft.json',
      metadata: {
        name: 'My NFT',
      },
    });
    t.deepEqual(compressedAsset!.compression, <DasApiAssetCompression>{
      eligible: false,
      compressed: true,
      data_hash: '2YDXnkcksCo3RZdVFJC8oq1CMQoYFgN6TMWnkffFrHAM',
      creator_hash: 'EKDHSGbrGztomDfuiV4iqiZ6LschDJPsFiXjZ83f92Md',
      asset_hash: '8KPK2EQ7g3edRv4au36fRNwFPcfAvP3HnH2VFqsBQje7',
      tree: 'Hw2qE4TKe8rt3VGWupLEH7wZtTrbBAzuU7LWBXfhGNMJ',
      seq: 1,
      leaf_id: 0,
    });
    t.deepEqual(compressedAsset!.grouping.length, 1);
    t.like(compressedAsset!.grouping[0], {
      group_key: 'collection',
      group_value: '3KPARzW2CoGhFYMKbxjGuGQfF3w2o9shnnjKZmCHCjBU',
    });
    t.deepEqual(compressedAsset!.mutable, true);
    t.deepEqual(compressedAsset!.burnt, false);

    // Regular asset assertions
    t.deepEqual(regularAsset!.interface, 'ProgrammableNFT');
    t.deepEqual(regularAsset!.id, regularAssetId);
    t.like(regularAsset!.content, <DasApiAssetContent>{
      metadata: {
        name: 'Mad Lads #4221',
      },
    });
    t.like(regularAsset!.compression, <DasApiAssetCompression>{
      compressed: false,
    });
    t.deepEqual(regularAsset!.grouping.length, 1);
    t.like(regularAsset!.grouping[0], {
      group_key: 'collection',
      group_value: 'J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w',
    });
    t.deepEqual(regularAsset!.mutable, true);
    t.deepEqual(regularAsset!.burnt, false);
  });

  test(`it can fetch multiple assets by ID with showUnverifiedCollections true (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const compressedAssetId = publicKey(
      'DNzerLDcC5apcAQQ2Wx3qfRK1NPP6g5Bsg11fPpWkRtA'
    );
    const regularAssetId = publicKey(
      'DSDRbKDyCVH3EhghB3djTCM1Ktj4Vbk6cXrPnMCbPXqs'
    );

    // When we fetch the assets using their IDs with display options.
    const assets = await umi.rpc.getAssets({
      assetIds: [compressedAssetId, regularAssetId],
      displayOptions: {
        showUnverifiedCollections: true,
      },
    });

    // Then we expect to get the assets back.
    t.is(assets.length, 2);
    t.deepEqual(assets[0].id, compressedAssetId);
    t.deepEqual(assets[1].id, regularAssetId);
    //And asset1, which is not verified in a collection should have grouping data
    t.deepEqual(assets[1].grouping.length, 1);
    t.like(assets[1].grouping[0], {
      group_key: 'collection',
      group_value: 'SMBtHCCC6RYRutFEPb4gZqeBLUZbMNhRKaMKZZLHi7W',
      verified: false,
    });
  });

  test(`it can fetch multiple assets by ID with showCollectionMetadata true (${endpoint.name})`, async (t) => {
    // Given a minted NFT.
    const umi = createUmi(endpoint.url);
    const compressedAssetId = publicKey(
      'DNzerLDcC5apcAQQ2Wx3qfRK1NPP6g5Bsg11fPpWkRtA'
    );
    const regularAssetId = publicKey(
      'G3nEdTzAvPvSuj2Z5oSSiMN42NayQDZvkC3usMrnGaTi'
    );

    // When we fetch the assets using their IDs with display options.
    const assets = await umi.rpc.getAssets({
      assetIds: [compressedAssetId, regularAssetId],
      displayOptions: {
        showCollectionMetadata: true,
      },
    });

    // Then we expect to get the assets back with collection metadata.
    t.is(assets.length, 2);
    t.true(assets.some((asset) => asset.id === regularAssetId));

    // Verify collection metadata is present in the grouping
    const assetWithCollectionMetadata = assets.find(
      (asset) => asset.id === regularAssetId
    );
    t.truthy(
      assetWithCollectionMetadata,
      'Expected to find an asset with collection metadata'
    );
    if (!assetWithCollectionMetadata) return;
    t.like(assetWithCollectionMetadata.grouping[0], {
      group_key: 'collection',
      group_value: 'J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w',
      verified: undefined,
      collection_metadata: {
        name: 'Mad Lads',
        symbol: 'MAD',
        image:
          'https://madlads-collection.s3.us-west-2.amazonaws.com/_collection.png',
        description: 'Fock it.',
      },
    });
  });

  test(`it can fetch multiple assets by ID with showFungible true (${endpoint.name})`, async (t) => {
    // Given a minted NFT and a fungible token.
    const umi = createUmi(endpoint.url);
    const nftAssetId = publicKey(
      'DNzerLDcC5apcAQQ2Wx3qfRK1NPP6g5Bsg11fPpWkRtA'
    );
    const fungibleAssetId = publicKey(
      '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump'
    );

    // When we fetch the assets using their IDs with showFungible true.
    const assets = await umi.rpc.getAssets({
      assetIds: [nftAssetId, fungibleAssetId],
      displayOptions: {
        showFungible: true,
      },
    });

    // Then we expect to get both assets back.
    t.is(assets.length, 2);
    const fungibleAsset = assets.find(
      (asset) => asset.interface === 'FungibleToken'
    );
    t.truthy(fungibleAsset, 'Expected to find a fungible token');
    t.deepEqual(fungibleAsset?.id, fungibleAssetId);
  });
});
