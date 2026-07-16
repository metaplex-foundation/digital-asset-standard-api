import { DasApiAssetRoyalty } from './types';

/** Sentinel value indicating seller fee basis points are inherited from collection. */
export const SELLER_FEE_BASIS_POINTS_INHERIT = 0xffff;

/** Returns true when royalty is inherited from a collection Royalties plugin. */
export function isInheritedSfbpRoyalty(royalty: DasApiAssetRoyalty): boolean {
  return (
    royalty.basis_points === SELLER_FEE_BASIS_POINTS_INHERIT ||
    royalty.basis_points_inherited != null
  );
}

/**
 * Returns the effective royalty rate for display or payout (collection rate when
 * SFBP is inherited, otherwise the leaf rate).
 */
export function getResolvedSellerFeeBasisPoints(
  royalty: DasApiAssetRoyalty
): number {
  return royalty.basis_points_inherited ?? royalty.basis_points;
}
