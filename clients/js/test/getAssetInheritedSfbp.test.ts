import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import {
  DasApiAsset,
  DasApiAssetRoyalty,
  SELLER_FEE_BASIS_POINTS_INHERIT,
  getRawSellerFeeBasisPoints,
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
      percent: 0.075,
      basis_points: 750,
      basis_points_raw: SELLER_FEE_BASIS_POINTS_INHERIT,
      sfbp_inherited: true,
      primary_sale_happened: false,
      locked: false,
    });

    t.true(isInheritedSfbpRoyalty(asset.royalty));
    t.is(getRawSellerFeeBasisPoints(asset.royalty), 65535);
    t.is(getResolvedSellerFeeBasisPoints(asset.royalty), 750);

    t.is(asset.creators.length, 1);
    t.like(asset.creators[0], {
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
