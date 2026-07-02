import { DasApiAssetRoyalty } from './types';

/** Sentinel value indicating seller fee basis points are inherited from collection. */
export const SELLER_FEE_BASIS_POINTS_INHERIT = 0xffff;

/** Returns true when royalty was inherited from a collection Royalties plugin. */
export function isInheritedSfbpRoyalty(royalty: DasApiAssetRoyalty): boolean {
  return (
    royalty.sfbp_inherited === true ||
    royalty.basis_points_raw === SELLER_FEE_BASIS_POINTS_INHERIT
  );
}

/**
 * Returns the seller fee basis points stored on the leaf. For inherited SFBP
 * assets this is the inherit sentinel (65535), not the resolved collection rate.
 */
export function getRawSellerFeeBasisPoints(
  royalty: DasApiAssetRoyalty
): number {
  if (royalty.basis_points_raw !== undefined) {
    return royalty.basis_points_raw;
  }
  if (royalty.sfbp_inherited) {
    return SELLER_FEE_BASIS_POINTS_INHERIT;
  }
  return royalty.basis_points;
}

/**
 * Returns the effective royalty rate for display or payout (resolved collection
 * rate when SFBP is inherited, otherwise the leaf rate).
 */
export function getResolvedSellerFeeBasisPoints(
  royalty: DasApiAssetRoyalty
): number {
  return royalty.basis_points;
}
