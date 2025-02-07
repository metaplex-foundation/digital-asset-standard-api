import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch compressed assets by creator (${endpoint.name})`, async (t) => {
    // Given an creator address.
    const umi = createUmi(endpoint.url);
    const creator = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

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
    });
  });
});
