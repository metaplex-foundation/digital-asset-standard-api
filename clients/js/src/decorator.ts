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
  GetAssetsRpcInput,
  GetAssetRpcInput,
} from './types';

export interface DasApiInterface {
  /**
   * Return the metadata information of a compressed/standard asset.
   *
   * @param input the input parameters for the RPC call
   */
  getAsset(input: GetAssetRpcInput | PublicKey): Promise<DasApiAsset>;

  /**
   * Return the metadata information of multiple compressed/standard assets.
   *
   * @param input the input parameters for the RPC call
   */
  getAssets(input: GetAssetsRpcInput | PublicKey[]): Promise<DasApiAsset[]>;

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
): RpcInterface & DasApiInterface => {
  const validatePagination = (
    page: number | null | undefined,
    before?: string | null,
    after?: string | null
  ) => {
    if (typeof page === 'number' && (before || after)) {
      throw new DasApiError(
        'Pagination Error. Please use either page or before/after, but not both.'
      );
    }
  };

  return {
    ...rpc,
    getAsset: async (input: GetAssetRpcInput | PublicKey) => {
      const assetId =
        typeof input === 'object' && 'assetId' in input ? input.assetId : input;
      const displayOptions =
        typeof input === 'object' && 'displayOptions' in input ? input.displayOptions : {};

      const asset = await rpc.call<DasApiAsset | null>('getAsset', [
        assetId,
        displayOptions,
      ]);
      if (!asset) throw new DasApiError(`Asset not found: ${assetId}`);
      return asset;
    },
    getAssets: async (input: GetAssetsRpcInput | PublicKey[]) => {
      const assetIds = Array.isArray(input) ? input : input.assetIds;
      const displayOptions = Array.isArray(input)
        ? {}
        : input.displayOptions ?? {};

      const assets = await rpc.call<DasApiAsset[] | null>('getAssets', [
        assetIds,
        displayOptions,
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
      validatePagination(input.page, input.before, input.after);
      const assetList = await rpc.call<DasApiAssetList | null>(
        'getAssetsByAuthority',
        [
          input.authority,
          input.sortBy ?? null,
          input.limit ?? null,
          input.page ?? 1,
          input.before ?? null,
          input.after ?? null,
          input.displayOptions ?? {},
          input.cursor ?? null,
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
      validatePagination(input.page, input.before, input.after);
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
          input.displayOptions ?? {},
          input.cursor ?? null,
        ]
      );
      if (!assetList) {
        throw new DasApiError(`No assets found for creator: ${input.creator}`);
      }
      return assetList;
    },
    getAssetsByGroup: async (input: GetAssetsByGroupRpcInput) => {
      validatePagination(input.page, input.before, input.after);
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
          input.displayOptions ?? {},
          input.cursor ?? null,
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
      validatePagination(input.page, input.before, input.after);
      const assetList = await rpc.call<DasApiAssetList | null>(
        'getAssetsByOwner',
        [
          input.owner,
          input.sortBy ?? null,
          input.limit ?? null,
          input.page ?? 1,
          input.before ?? null,
          input.after ?? null,
          input.displayOptions ?? {},
          input.cursor ?? null,
        ]
      );
      if (!assetList) {
        throw new DasApiError(`No assets found for owner: ${input.owner}`);
      }
      return assetList;
    },
    searchAssets: async (input: SearchAssetsRpcInput) => {
      validatePagination(input.page, input.before, input.after);
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
        input.cursor ?? null,
        input.name ?? null,
        input.displayOptions ?? {},
        input.tokenType ?? null,
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
  };
};
