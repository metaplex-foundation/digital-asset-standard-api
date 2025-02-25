import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch compressed assets by authority (${endpoint.name})`, async (t) => {
    // Given an authority address.
    const umi = createUmi(endpoint.url);
    const authority = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

    // When we fetch the asset using the authority.
    const assets = await umi.rpc.getAssetsByAuthority({
      authority,
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the authority should be present.
    assets.items.forEach((asset) => {
      t.true(asset.authorities.some((other) => other.address === authority));
    });
  });

  test(`it can fetch assets by authority with showUnverifiedCollections true (${endpoint.name})`, async (t) => {
    // Given an authority address.
    const umi = createUmi(endpoint.url);
    const authority = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

    // When we fetch the asset using the authority with display options.
    const assets = await umi.rpc.getAssetsByAuthority({
      authority,
      displayOptions: {
        showUnverifiedCollections: true,
      },
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And that the authority is present
    assets.items.forEach((asset) => {
      t.true(asset.authorities.some((other) => other.address === authority));
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

  test(`it can fetch assets by authority with showUnverifiedCollections false (${endpoint.name})`, async (t) => {
    // Given an authority address.
    const umi = createUmi(endpoint.url);
    const authority = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

    // When we fetch the asset using the authority with display options.
    const assets = await umi.rpc.getAssetsByAuthority({
      authority,
      displayOptions: {
        showUnverifiedCollections: false,
      },
    });

    // Then we expect to find assets
    t.true(assets.items.length > 0);

    // And the authority should be present.
    assets.items.forEach((asset) => {
      t.true(asset.authorities.some((other) => other.address === authority));
    });
    // And any collection groupings present are verified
    assets.items.forEach((asset) => {
      asset.grouping.forEach((group) => {
        if (group.group_key === 'collection') {
          t.true(
            group.verified,
            'All present collection groupings should be verified'
          );
        }
      });
    });
  });

  test(`it can fetch assets by authority with showCollectionMetadata true (${endpoint.name})`, async (t) => {
    // Given an authority address.
    const umi = createUmi(endpoint.url);
    const authority = publicKey('DASPQfEAVcHp55eFmfstRduMT3dSfoTirFFsMHwUaWaz');

    // When we fetch the asset using the authority with display options.
    const assets = await umi.rpc.getAssetsByAuthority({
      authority,
      displayOptions: {
        showCollectionMetadata: true,
      },
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the authority should be present.
    assets.items.forEach((asset) => {
      t.true(asset.authorities.some((other) => other.address === authority));
    });

    // And collection metadata should be present in the grouping
    const assetWithCollectionMetadata = assets.items[0];
    t.true(assetWithCollectionMetadata.grouping.length > 0);
    const collectionGroup = assetWithCollectionMetadata.grouping.find(
      (group) => group.group_key === 'collection'
    );
    t.truthy(collectionGroup, 'Expected to find a collection group');
    t.like(collectionGroup, {
      group_key: 'collection',
      group_value: 'Dm1TRVw82roqpfqpzsFxSsWg6a4z3dku6ebVHSHuVo1c',
      collection_metadata: {
        name: 'My cNFT Collection',
        symbol: '',
        image: 'https://gateway.irys.xyz/8da3Er9Q39QRkdNhBNP7w5hDo5ZnydLNxLqe9i6s1Nak',
        description: '',
        external_url: ''
      }
    });
  });
});
