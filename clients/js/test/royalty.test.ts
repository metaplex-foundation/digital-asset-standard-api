import test from 'ava';
import {
  DasApiAssetRoyalty,
  SELLER_FEE_BASIS_POINTS_INHERIT,
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
  percent: 6.5535,
  basis_points: SELLER_FEE_BASIS_POINTS_INHERIT,
  basis_points_inherited: 750,
  percent_inherited: 0.075,
  primary_sale_happened: false,
  locked: false,
};

test('isInheritedSfbpRoyalty returns false for explicit leaf SFBP', (t) => {
  t.false(isInheritedSfbpRoyalty(explicitRoyalty));
});

test('isInheritedSfbpRoyalty returns true when basis_points is the inherit sentinel', (t) => {
  t.true(isInheritedSfbpRoyalty(inheritedRoyalty));
});

test('isInheritedSfbpRoyalty returns true when basis_points_inherited is set', (t) => {
  t.true(
    isInheritedSfbpRoyalty({
      ...explicitRoyalty,
      basis_points_inherited: 750,
    })
  );
});

test('getResolvedSellerFeeBasisPoints returns leaf rate for explicit SFBP', (t) => {
  t.is(getResolvedSellerFeeBasisPoints(explicitRoyalty), 550);
});

test('getResolvedSellerFeeBasisPoints returns collection rate for inherited SFBP', (t) => {
  t.is(getResolvedSellerFeeBasisPoints(inheritedRoyalty), 750);
});
