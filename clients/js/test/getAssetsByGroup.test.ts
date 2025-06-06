import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';
import { DasApiAsset } from '../src';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch a compressed asset by group (${endpoint.name})`, async (t) => {
    // Given a group (key, value) pair.
    const umi = createUmi(endpoint.url);
    const groupKey = 'collection';
    const groupValue = publicKey(
      '5PA96eCFHJSFPY9SWFeRJUHrpoNF5XZL6RrE1JADXhxf'
    );

    // When we fetch the asset using the group information.
    const assets = await umi.rpc.getAssetsByGroup({ groupKey, groupValue });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the collection should match.
    assets.items.forEach((asset) => {
      t.like(assets.items[0], <DasApiAsset>{
        grouping: [
          {
            group_key: groupKey,
            group_value: groupValue.toString(),
          },
        ],
      });
    });
  });

  test(`it can fetch assets by group hiding unverified collections with showUnverifiedCollections false (${endpoint.name})`, async (t) => {
    // Given a group (key, value) pair.
    const umi = createUmi(endpoint.url);
    const groupKey = 'collection';
    const groupValue = publicKey(
      '3ZVut1dixVCCcyR8kgFcfqfZPrgyAWN18HY6CwjJQdsG'
    );

    // When we fetch the asset using the group information with display options.
    const assets = await umi.rpc.getAssetsByGroup({
      groupKey,
      groupValue,
      displayOptions: {
        showUnverifiedCollections: false,
      },
    });

    // And the collection should match and be verified
    assets.items.forEach((asset) => {
      t.like(assets.items[0], <DasApiAsset>{
        grouping: [
          {
            group_key: groupKey,
            group_value: groupValue.toString(),
          },
        ],
      });
    });
  });

  test(`it can fetch assets by group showing unverified collections with showUnverifiedCollections true (${endpoint.name})`, async (t) => {
    // Given a group (key, value) pair.
    const umi = createUmi(endpoint.url);
    const groupKey = 'collection';
    const groupValue = publicKey(
      '3ZVut1dixVCCcyR8kgFcfqfZPrgyAWN18HY6CwjJQdsG'
    );

    // When we fetch the asset using the group information with display options.
    const assets = await umi.rpc.getAssetsByGroup({
      groupKey,
      groupValue,
      displayOptions: {
        showUnverifiedCollections: true,
      },
    });

    // And at least one asset should have an unverified collection
    const assetWithUnverifiedCollection = assets.items.find((asset) =>
      asset.grouping?.some(
        (group) =>
          group.group_key === groupKey &&
          group.group_value === groupValue.toString() &&
          group.verified === false
      )
    );
    t.truthy(
      assetWithUnverifiedCollection,
      'Expected to find at least one asset with an unverified collection'
    );
  });

  test(`it can fetch assets by group with collection metadata when showCollectionMetadata is true (${endpoint.name})`, async (t) => {
    // Given a group (key, value) pair.
    const umi = createUmi(endpoint.url);
    const groupKey = 'collection';
    const groupValue = publicKey('SMBtHCCC6RYRutFEPb4gZqeBLUZbMNhRKaMKZZLHi7W');

    // When we fetch the asset using the group information with display options.
    const assets = await umi.rpc.getAssetsByGroup({
      groupKey,
      groupValue,
      displayOptions: {
        showCollectionMetadata: true,
      },
    });

    // Then we expect to find assets
    t.true(assets.items.length > 0);

    // And the collection grouping should include collection metadata
    assets.items.forEach((asset) => {
      const collectionGroup = asset.grouping?.find(
        (group) =>
          group.group_key === groupKey &&
          group.group_value === groupValue.toString()
      );
      t.truthy(collectionGroup, 'Expected to find collection group');
      if (!collectionGroup) return;

      t.truthy(
        collectionGroup.collection_metadata,
        'Expected collection group to have collection_metadata'
      );
      if (!collectionGroup.collection_metadata) return;

      t.true(
        typeof collectionGroup.collection_metadata.name === 'string',
        'Expected collection_metadata to have a name'
      );
      t.true(
        typeof collectionGroup.collection_metadata.description === 'string',
        'Expected collection_metadata to have a description'
      );
      t.true(
        typeof collectionGroup.collection_metadata.image === 'string',
        'Expected collection_metadata to have an image'
      );
      t.true(
        typeof collectionGroup.collection_metadata.symbol === 'string',
        'Expected collection_metadata to have a symbol'
      );
    });
  });
});
