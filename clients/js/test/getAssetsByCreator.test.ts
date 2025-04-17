import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch compressed assets by creator (${endpoint.name})`, async (t) => {
    // Given an creator address.
    const umi = createUmi(endpoint.url);
    const creator = publicKey('mdaoxg4DVGptU4WSpzGyVpK3zqsgn7Qzx5XNgWTcEA2');

    // When we fetch the asset using the creator.
    const assets = await umi.rpc.getAssetsByCreator({
      creator,
      onlyVerified: true,
      limit: 10,
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the creator should be present.
    assets.items.forEach((asset) => {
      t.true(asset.creators.some((other) => other.address === creator));
    });
  });

  test(`it can fetch assets by creator not limiting to verified creators (${endpoint.name})`, async (t) => {
    // Given an creator address.
    const umi = createUmi(endpoint.url);
    const creator = publicKey('3p1hnJ5ffeDamjAeBRReBdVfnef3jd19wBiTSLd3ikDE');

    // When we fetch the asset using the creator.
    const assets = await umi.rpc.getAssetsByCreator({
      creator,
      onlyVerified: false,
      limit: 1000,
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And at least one creator should be unverified
    const assetWithUnverifiedCreator = assets.items.find((asset) =>
      asset.creators.some((creator) => creator.verified === false)
    );
    t.truthy(assetWithUnverifiedCreator, 'Expected to find at least one asset with an unverified creator');
  });

  test(`it can fetch assets by creator limiting to verified creators (${endpoint.name})`, async (t) => {
    // Given an creator address.
    const umi = createUmi(endpoint.url);
    const creator = publicKey('Ex2A8tN3DbdA8N2F1PC6jLZmpfNBKAVRMEivBAwxcatC');

    // When we fetch the asset using the creator.
    const assets = await umi.rpc.getAssetsByCreator({
      creator,
      onlyVerified: true,
      limit: 10,
    });

    // Then we don't expect to find assets.
    t.true(assets.items.length === 0);
  });

  test(`it can fetch assets by creator with showUnverifiedCollections true (${endpoint.name})`, async (t) => {
    // Given an creator address.
    const umi = createUmi(endpoint.url);
    const creator = publicKey('3p1hnJ5ffeDamjAeBRReBdVfnef3jd19wBiTSLd3ikDE');

    // When we fetch the asset using the creator with display options.
    const assets = await umi.rpc.getAssetsByCreator({
      creator,
      onlyVerified: true,
      limit: 10,
      displayOptions: {
        showUnverifiedCollections: true,
      },
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 1);

    // And the creator should be present.
    assets.items.forEach((asset) => {
      t.true(asset.creators.some((other) => other.address === creator));
    });

    //  and that at least one asset with unverified collection exists
    const assetWithUnverifiedCollection = assets.items.find((asset) =>
      asset.grouping?.some(
        (group) => group.group_key === 'collection' && group.verified === false
      )
    );
    t.truthy(
      assetWithUnverifiedCollection,
      'Expected to find at least one asset with an unverified collection'
    );
  });

  test(`it can fetch assets by creator with showUnverifiedCollections false (${endpoint.name})`, async (t) => {
    // Given an creator address.
    const umi = createUmi(endpoint.url);
    const creator = publicKey('3p1hnJ5ffeDamjAeBRReBdVfnef3jd19wBiTSLd3ikDE');

    // When we fetch the asset using the creator with display options.
    const assets = await umi.rpc.getAssetsByCreator({
      creator,
      onlyVerified: true,
      limit: 10,
      displayOptions: {
        showUnverifiedCollections: false,
      },
    });
console.log(JSON.stringify(assets, null, 2))
    // Then we expect to find assets.
    t.true(assets.items.length > 1);

    // And the creator should be present.
    assets.items.forEach((asset) => {
      t.true(asset.creators.some((other) => other.address === creator));

      // And all collections should be verified
      const collectionGroups =
        asset.grouping?.filter((group) => group.group_key === 'collection') ??
        [];
      collectionGroups.forEach((group) => {
        t.true(group.verified !== false, 'Expected all collection groups to be verified or have no verified field');
      });
    });
  });

  test(`it can fetch assets by creator with showCollectionMetadata true (${endpoint.name})`, async (t) => {
    // Given an creator address.
    const umi = createUmi(endpoint.url);
    const creator = publicKey('mdaoxg4DVGptU4WSpzGyVpK3zqsgn7Qzx5XNgWTcEA2');

    // When we fetch the asset using the creator with display options.
    const assets = await umi.rpc.getAssetsByCreator({
      creator,
      onlyVerified: true,
      limit: 10,
      displayOptions: {
        showCollectionMetadata: true,
      },
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the creator should be present.
    assets.items.forEach((asset) => {
      t.true(asset.creators.some((other) => other.address === creator));
    });

    // And collection metadata should be present in the grouping for assets that have collections
    const assetWithCollection = assets.items.find((asset) =>
      asset.grouping?.some(
        (group) =>
          group.group_key === 'collection' &&
          group.group_value === 'SMBtHCCC6RYRutFEPb4gZqeBLUZbMNhRKaMKZZLHi7W'
      )
    );
    t.truthy(
      assetWithCollection,
      'Expected to find at least one asset with a collection'
    );

    // We've verified assetWithCollection exists with t.truthy above
    const collectionGroup = assetWithCollection!.grouping.find(
      (group) => group.group_key === 'collection'
    );
    t.truthy(collectionGroup, 'Expected to find a collection group');
    t.like(collectionGroup, {
      group_key: 'collection',
      group_value: 'SMBtHCCC6RYRutFEPb4gZqeBLUZbMNhRKaMKZZLHi7W',
      collection_metadata: {
        name: 'SMB Gen2',
        symbol: 'SMB',
        image:
          'https://arweave.net/lZ5FdIVagNoNvI4QFoHhB6Xyn4oVGLV9xOTW32WBC20',
        description:
          'SMB is a collection of 5000 randomly generated 24x24 pixels NFTs on the Solana Blockchain. Each SolanaMonkey is unique and comes with different type and attributes varying in rarity.',
        external_url: 'https://solanamonkey.business/',
      },
    });
  });
});
