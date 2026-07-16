import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import {
  DasApiAsset,
  DasApiAssetRoyalty,
  SELLER_FEE_BASIS_POINTS_INHERIT,
  getResolvedSellerFeeBasisPoints,
  isInheritedSfbpRoyalty,
} from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

/** Inherited-SFBP fixture recorded on localhost (localnet). */
const INHERITED_SFBP_ASSET_ID = publicKey(
  'Fwjc1T9w8RowCiSHD7PGBYmAjhE6BZ4caqpPpR2Yf1GV'
);
const INHERITED_SFBP_COLLECTION =
  'HQ3HWHaAsfLj9kLu93EuEuVwo5eZCRm8UaBu4oD16fu3';
const INHERITED_SFBP_COLLECTION_CREATOR =
  'J4NHd2zZVHYakcN3KWFvUJCfraeeD9G93edcPs7hPEPW';

// TODO: change `test.skip` to `test` once inherited SFBP is live on mainnet DAS.
DAS_API_ENDPOINTS.forEach((endpoint) => {
  test.skip(`it resolves inherited SFBP royalty from collection (${endpoint.name})`, async (t) => {
    t.timeout(40_000);

    const umi = createUmi(endpoint.url);
    const asset = await umi.rpc.getAsset(INHERITED_SFBP_ASSET_ID);

    t.is(asset.interface, 'MplBubblegumV2');
    t.deepEqual(asset.id, INHERITED_SFBP_ASSET_ID);
    t.like(asset.content.metadata, { name: 'Inherited SFBP Fixture' });
    t.like(asset.grouping[0], {
      group_key: 'collection',
      group_value: INHERITED_SFBP_COLLECTION,
    });

    t.like(asset.royalty, <DasApiAssetRoyalty>{
      royalty_model: 'creators',
      target: null,
      percent: 6.5535,
      basis_points: SELLER_FEE_BASIS_POINTS_INHERIT,
      basis_points_inherited: 750,
      percent_inherited: 0.075,
      primary_sale_happened: false,
      locked: false,
    });

    t.true(isInheritedSfbpRoyalty(asset.royalty));
    t.is(asset.royalty.basis_points, SELLER_FEE_BASIS_POINTS_INHERIT);
    t.is(getResolvedSellerFeeBasisPoints(asset.royalty), 750);

    t.deepEqual(asset.creators, []);
    t.is(asset.creators_inherited?.length, 1);
    t.like(asset.creators_inherited![0], {
      address: publicKey(INHERITED_SFBP_COLLECTION_CREATOR),
      share: 100,
      verified: true,
    });

    t.like(asset.compression, {
      compressed: true,
      creator_hash: 'EKDHSGbrGztomDfuiV4iqiZ6LschDJPsFiXjZ83f92Md',
      collection_hash: '6nWVsKJmDqMtjVjgDyvXGUgGDCYCxVY8MJQPikEKE2oD',
      leaf_id: 0,
    });

    t.like(asset, <DasApiAsset>{
      interface: 'MplBubblegumV2',
      id: INHERITED_SFBP_ASSET_ID,
      mutable: true,
      burnt: false,
    });
  });
});
