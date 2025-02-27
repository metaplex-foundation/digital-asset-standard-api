import { PublicKey, RpcInterface } from '@metaplex-foundation/umi';
import { DasApiError } from './errors';
import {
  GetAssetProofRpcResponse,
  GetAssetsByAuthorityRpcInput,
  GetAssetsByCreatorRpcInput,
  GetAssetsByGroupRpcInput,
  GetAssetsByOwnerRpcInput,
  DasApiAsset,
  DasApiAssetList,
  SearchAssetsRpcInput,
  GetAssetSignaturesRpcResponse,
  GetAssetProofsRpcResponse,
  GetAssetSignaturesRpcInput,
} from './types';

export interface DasApiInterface {
  /**
   * Return the metadata information of a compressed/standard asset.
   *
   * @param assetId the id of the asset to fetch
   */
  getAsset(assetId: PublicKey): Promise<DasApiAsset>;

  /**
   * Return the metadata information of multiple compressed/standard assets.
   *
   * @param assetIds Array of the ids of the assets to fetch
   */
  getAssets(assetIds: PublicKey[]): Promise<DasApiAsset[]>;

  /**
   * Return the merkle tree proof information for a compressed asset.
   *
   * @param assetId the id of the asset to fetch the proof for
   */
  getAssetProof(assetId: PublicKey): Promise<GetAssetProofRpcResponse>;

  /**
   * Return the merkle tree proof information for multiple compressed assets.
   *
   * @param assetIds array of the ids of the assets to fetch the proofs for
   */
  getAssetProofs(assetIds: PublicKey[]): Promise<GetAssetProofsRpcResponse>;

  /**
   * Return the list of assets given an authority address.
   *
   * @param input the input parameters for the RPC call
   */
  getAssetsByAuthority(
    input: GetAssetsByAuthorityRpcInput
  ): Promise<DasApiAssetList>;

  /**
   * Return the list of assets given a creator address.
   *
   * @param input the input parameters for the RPC call
   */
  getAssetsByCreator(
    input: GetAssetsByCreatorRpcInput
  ): Promise<DasApiAssetList>;

  /**
   * Return the list of assets given a group (key, value) pair.
   *
   * @param input the input parameters for the RPC call
   */
  getAssetsByGroup(input: GetAssetsByGroupRpcInput): Promise<DasApiAssetList>;

  /**
   * Return the list of assets given an owner address.
   *
   * @param input the input parameters for the RPC call
   */
  getAssetsByOwner(input: GetAssetsByOwnerRpcInput): Promise<DasApiAssetList>;

  /**
   * Return the list of assets given a search criteria.
   *
   * @param input the input parameters for the RPC call
   */
  searchAssets(input: SearchAssetsRpcInput): Promise<DasApiAssetList>;

  /**
   * Return the transaction signatures for a compressed asset
   *
   * @param input the input parameters for the RPC call
   */
  getAssetSignatures(
    input: GetAssetSignaturesRpcInput
  ): Promise<GetAssetSignaturesRpcResponse>;
}

export const createDasApiDecorator = (
  rpc: RpcInterface
): RpcInterface & DasApiInterface => ({
  ...rpc,
  getAsset: async (assetId: PublicKey) => {
    const asset = await rpc.call<DasApiAsset | null>('getAsset', [assetId]);
    if (!asset) throw new DasApiError(`Asset not found: ${assetId}`);
    return asset;
  },
  getAssets: async (assetIds: PublicKey[]) => {
    const assets = await rpc.call<DasApiAsset[] | null>('getAssets', [
      assetIds,
    ]);
    if (!assets) throw new DasApiError(`No assets found: ${assetIds}`);
    return assets;
  },
  getAssetProof: async (assetId: PublicKey) => {
    const proof = await rpc.call<GetAssetProofRpcResponse | null>(
      'getAssetProof',
      [assetId]
    );
    if (!proof) throw new DasApiError(`No proof found for asset: ${assetId}`);
    return proof;
  },
  getAssetProofs: async (assetIds: PublicKey[]) => {
    const proofs = await rpc.call<GetAssetProofsRpcResponse | null>(
      'getAssetProofs',
      [assetIds]
    );
    if (!proofs)
      throw new DasApiError(`No proofs found for assets: ${assetIds}`);
    return proofs;
  },
  getAssetsByAuthority: async (input: GetAssetsByAuthorityRpcInput) => {
    if (typeof input.page === 'number' && (input.before || input.after)) {
      throw new DasApiError(
        'Pagination Error. Please use either page or before/after, but not both.'
      );
    }
    const assetList = await rpc.call<DasApiAssetList | null>(
      'getAssetsByAuthority',
      [
        input.authority,
        input.sortBy ?? null,
        input.limit ?? null,
        input.page ?? 1,
        input.before ?? null,
        input.after ?? null,
      ]
    );
    if (!assetList) {
      throw new DasApiError(
        `No assets found for authority: ${input.authority}`
      );
    }
    return assetList;
  },
  getAssetsByCreator: async (input: GetAssetsByCreatorRpcInput) => {
    if (typeof input.page === 'number' && (input.before || input.after)) {
      throw new DasApiError(
        'Pagination Error. Please use either page or before/after, but not both.'
      );
    }
    const assetList = await rpc.call<DasApiAssetList | null>(
      'getAssetsByCreator',
      [
        input.creator,
        input.onlyVerified,
        input.sortBy ?? null,
        input.limit ?? null,
        input.page ?? 1,
        input.before ?? null,
        input.after ?? null,
      ]
    );
    if (!assetList) {
      throw new DasApiError(`No assets found for creator: ${input.creator}`);
    }
    return assetList;
  },
  getAssetsByGroup: async (input: GetAssetsByGroupRpcInput) => {
    if (typeof input.page === 'number' && (input.before || input.after)) {
      throw new DasApiError(
        'Pagination Error. Please use either page or before/after, but not both.'
      );
    }
    const assetList = await rpc.call<DasApiAssetList | null>(
      'getAssetsByGroup',
      [
        input.groupKey,
        input.groupValue,
        input.sortBy ?? null,
        input.limit ?? null,
        input.page ?? 1,
        input.before ?? null,
        input.after ?? null,
      ]
    );
    if (!assetList) {
      throw new DasApiError(
        `No assets found for group: ${input.groupKey} => ${input.groupValue}`
      );
    }
    return assetList;
  },
  getAssetsByOwner: async (input: GetAssetsByOwnerRpcInput) => {
    if (typeof input.page === 'number' && (input.before || input.after)) {
      throw new DasApiError(
        'Pagination Error. Please use either page or before/after, but not both.'
      );
    }
    const assetList = await rpc.call<DasApiAssetList | null>(
      'getAssetsByOwner',
      [
        input.owner,
        input.sortBy ?? null,
        input.limit ?? null,
        input.page ?? 1,
        input.before ?? null,
        input.after ?? null,
      ]
    );
    if (!assetList) {
      throw new DasApiError(`No assets found for owner: ${input.owner}`);
    }
    return assetList;
  },
  searchAssets: async (input: SearchAssetsRpcInput) => {
    if (typeof input.page === 'number' && (input.before || input.after)) {
      throw new DasApiError(
        'Pagination Error. Please use either page or before/after, but not both.'
      );
    }
    const assetList = await rpc.call<DasApiAssetList | null>('searchAssets', [
      input.negate ?? null,
      input.conditionType ?? null,
      input.interface ?? null,
      input.owner ?? null,
      input.ownerType ?? null,
      input.creator ?? null,
      input.creatorVerified ?? null,
      input.authority ?? null,
      input.grouping ?? null,
      input.delegate ?? null,
      input.frozen ?? null,
      input.supply ?? null,
      input.supplyMint ?? null,
      input.compressed ?? null,
      input.compressible ?? null,
      input.royaltyModel ?? null,
      input.royaltyTarget ?? null,
      input.royaltyAmount ?? null,
      input.burnt ?? null,
      input.sortBy ?? null,
      input.limit ?? null,
      input.page ?? 1,
      input.before ?? null,
      input.after ?? null,
      input.jsonUri ?? null,
    ]);
    if (!assetList) {
      throw new DasApiError('No assets found for the given search criteria');
    }
    return assetList;
  },
  getAssetSignatures: async (input: GetAssetSignaturesRpcInput) => {
    const signatures = await rpc.call<GetAssetSignaturesRpcResponse | null>(
      'getAssetSignaturesV2',
      [
        'assetId' in input ? input.assetId : null,
        input.limit ?? null,
        input.page ?? null,
        input.before ?? null,
        input.after ?? null,
        'tree' in input ? input.tree : null,
        'tree' in input ? input.leaf_index : null,
        input.cursor ?? null,
        input.sort_direction ?? null,
      ]
    );
    if (!signatures) {
      const identifier =
        'assetId' in input
          ? `asset: ${input.assetId}`
          : `tree: ${input.tree}, leaf_index: ${input.leaf_index}`;
      throw new DasApiError(`No signatures found for ${identifier}`);
    }
    return signatures;
  },
});
