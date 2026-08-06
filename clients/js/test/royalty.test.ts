import test from 'ava';
import {
  DasApiAssetRoyalty,
  SELLER_FEE_BASIS_POINTS_INHERIT,
  getRawSellerFeeBasisPoints,
  getResolvedSellerFeeBasisPoints,
  isInheritedSfbpRoyalty,
} from '../src';

const explicitRoyalty: DasApiAssetRoyalty = {
  royalty_model: 'creators',
  target: null,
  percent: 0.055,
  basis_points: 550,
  primary_sale_happened: false,
  locked: false,
};

const inheritedRoyalty: DasApiAssetRoyalty = {
  royalty_model: 'creators',
  target: null,
  percent: 0.075,
  basis_points: 750,
  basis_points_raw: SELLER_FEE_BASIS_POINTS_INHERIT,
  sfbp_inherited: true,
  primary_sale_happened: false,
  locked: false,
};

test('isInheritedSfbpRoyalty returns false for explicit leaf SFBP', (t) => {
  t.false(isInheritedSfbpRoyalty(explicitRoyalty));
});

test('isInheritedSfbpRoyalty returns true when sfbp_inherited is set', (t) => {
  t.true(isInheritedSfbpRoyalty(inheritedRoyalty));
});

test('isInheritedSfbpRoyalty returns true when only basis_points_raw sentinel is set', (t) => {
  t.true(
    isInheritedSfbpRoyalty({
      ...explicitRoyalty,
      basis_points_raw: SELLER_FEE_BASIS_POINTS_INHERIT,
    })
  );
});

test('getRawSellerFeeBasisPoints returns leaf rate for explicit SFBP', (t) => {
  t.is(getRawSellerFeeBasisPoints(explicitRoyalty), 550);
});

test('getRawSellerFeeBasisPoints returns inherit sentinel for inherited SFBP', (t) => {
  t.is(getRawSellerFeeBasisPoints(inheritedRoyalty), 65535);
});

test('getResolvedSellerFeeBasisPoints returns collection rate for inherited SFBP', (t) => {
  t.is(getResolvedSellerFeeBasisPoints(inheritedRoyalty), 750);
});
