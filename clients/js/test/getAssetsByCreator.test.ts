import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch compressed assets by creator (${endpoint.name})`, async (t) => {
    // Given an creator address.
    const umi = createUmi(endpoint.url);
    const creator = publicKey('6pZYD8qi7g8XT8pPg8L6NJs2znZkQ4CoPjTz6xqwnBWg');

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
    const creator = publicKey('Ex2A8tN3DbdA8N2F1PC6jLZmpfNBKAVRMEivBAwxcatC');

    // When we fetch the asset using the creator.
    const assets = await umi.rpc.getAssetsByCreator({
      creator,
      onlyVerified: false,
      limit: 10,
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the creator should be present.
    assets.items.forEach((asset) => {
      const creatorAccount = asset.creators.find(
        (other) => other.address === creator
      );
      t.true(creatorAccount !== undefined);
      t.false(creatorAccount?.verified);
    });
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
    const creator = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

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
    const creator = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

    // When we fetch the asset using the creator with display options.
    const assets = await umi.rpc.getAssetsByCreator({
      creator,
      onlyVerified: true,
      limit: 10,
      displayOptions: {
        showUnverifiedCollections: false,
      },
    });

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
        t.true(group.verified, 'Expected all collection groups to be verified');
      });
    });
  });

  test(`it can fetch assets by creator with showCollectionMetadata true (${endpoint.name})`, async (t) => {
    // Given an creator address.
    const umi = createUmi(endpoint.url);
    const creator = publicKey('DAS7Wnf86QNmwKWacTe8KShU7V6iw7wwcPjG9qXLPkEU');

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
          group.group_value === 'Ce9hnNkbwNP7URw6TkhpopcKeNm8s4SchbBJS3m8tTu2'
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
      group_value: 'Ce9hnNkbwNP7URw6TkhpopcKeNm8s4SchbBJS3m8tTu2',
      collection_metadata: {
        name: 'Chiaki Azure 55 Collection',
        symbol: '',
        image:
          'https://arweave.net/fFcYDkRHF-936IbAZ3pLTmFAmxF1WlW3KwWndYPgI8Q/chiaki-violet-azure-common.png',
        description:
          'MONMONMON is a collection from the creativity of Peelander Yellow. Each MONMONMON has unique and kind abilities that can be used to help others and play with your friends. There are secrets in each MONMONMON. We love you.',
        external_url: '',
      },
    });
  });
});
