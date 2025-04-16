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
  DisplayOptions,
  DasApiParamAssetSortBy,
  DasApiPropGroupKey,
  DasApiAssetInterface,
  TokenType,
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
        typeof input === 'object' && 'displayOptions' in input
          ? input.displayOptions
          : {};

      const asset = await rpc.call<
        DasApiAsset | null,
        { id: PublicKey; options: DisplayOptions | undefined }
      >('getAsset', {
        id: assetId,
        options: displayOptions,
      });
      if (!asset) throw new DasApiError(`Asset not found: ${assetId}`);
      return asset;
    },
    getAssets: async (input: GetAssetsRpcInput | PublicKey[]) => {
      const assetIds = Array.isArray(input) ? input : input.assetIds;
      const displayOptions = Array.isArray(input)
        ? {}
        : input.displayOptions ?? {};

      const assets = await rpc.call<
        DasApiAsset[] | null,
        { ids: PublicKey[]; options: DisplayOptions | undefined }
      >('getAssets', {
        ids: assetIds,
        options: displayOptions,
      });
      if (!assets) throw new DasApiError(`No assets found: ${assetIds}`);
      return assets;
    },
    getAssetProof: async (assetId: PublicKey) => {
      const proof = await rpc.call<
        GetAssetProofRpcResponse | null,
        { id: PublicKey }
      >('getAssetProof', { id: assetId });
      if (!proof) throw new DasApiError(`No proof found for asset: ${assetId}`);
      return proof;
    },
    getAssetProofs: async (assetIds: PublicKey[]) => {
      const proofs = await rpc.call<
        GetAssetProofsRpcResponse | null,
        { ids: PublicKey[] }
      >('getAssetProofs', { ids: assetIds });
      if (!proofs)
        throw new DasApiError(`No proofs found for assets: ${assetIds}`);
      return proofs;
    },
    getAssetsByAuthority: async (input: GetAssetsByAuthorityRpcInput) => {
      validatePagination(input.page, input.before, input.after);
      const assetList = await rpc.call<DasApiAssetList | null, GetAssetsByAuthorityRpcInput>(
        'getAssetsByAuthority',
        {
          authority: input.authority,
          sortBy: input.sortBy ?? null,
          limit: input.limit ?? null,
          page: input.page ?? 1,
          before: input.before ?? null,
          after: input.after ?? null,
          displayOptions: input.displayOptions ?? {},
          cursor: input.cursor ?? null,
        }
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
      const assetList = await rpc.call<DasApiAssetList | null, {
        creatorAddress: PublicKey;
        onlyVerified: boolean;
        sortBy: DasApiParamAssetSortBy | null;
        limit: number | null;
        page: number;
        before: string | null;
        after: string | null;
        displayOptions: DisplayOptions;
        cursor: string | null;
      }>(
        'getAssetsByCreator',
        {
          creatorAddress: input.creator,
          onlyVerified: input.onlyVerified,
          sortBy: input.sortBy ?? null,
          limit: input.limit ?? null,
          page: input.page ?? 1,
          before: input.before ?? null,
          after: input.after ?? null,
          displayOptions: input.displayOptions ?? {},
          cursor: input.cursor ?? null,
        }
      );
      if (!assetList) {
        throw new DasApiError(`No assets found for creator: ${input.creator}`);
      }
      return assetList;
    },
    getAssetsByGroup: async (input: GetAssetsByGroupRpcInput) => {
      validatePagination(input.page, input.before, input.after);
      const assetList = await rpc.call<DasApiAssetList | null, {
        groupKey: DasApiPropGroupKey;
        groupValue: string;
        sortBy: DasApiParamAssetSortBy | null;
        limit: number | null;
        page: number;
        before: string | null;
        after: string | null;
        displayOptions: DisplayOptions;
        cursor: string | null;
      }>(
        'getAssetsByGroup',
        {
          groupKey: input.groupKey,
          groupValue: input.groupValue,
          sortBy: input.sortBy ?? null,
          limit: input.limit ?? null,
          page: input.page ?? 1,
          before: input.before ?? null,
          after: input.after ?? null,
          displayOptions: input.displayOptions ?? {},
          cursor: input.cursor ?? null,
        }
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
      const assetList = await rpc.call<DasApiAssetList | null, {
        ownerAddress: PublicKey;
        sortBy: DasApiParamAssetSortBy | null;
        limit: number | null;
        page: number;
        before: string | null;
        after: string | null;
        displayOptions: DisplayOptions;
        cursor: string | null;
      }>(
        'getAssetsByOwner',
        {
          ownerAddress: input.owner,
          sortBy: input.sortBy ?? null,
          limit: input.limit ?? null,
          page: input.page ?? 1,
          before: input.before ?? null,
          after: input.after ?? null,
          displayOptions: input.displayOptions ?? {},
          cursor: input.cursor ?? null,
        }
      );
      if (!assetList) {
        throw new DasApiError(`No assets found for owner: ${input.owner}`);
      }
      return assetList;
    },
    searchAssets: async (input: SearchAssetsRpcInput) => {
      validatePagination(input.page, input.before, input.after);
      const assetList = await rpc.call<DasApiAssetList | null, {
        negate: boolean | null;
        conditionType: 'all' | 'any' | null;
        interface: DasApiAssetInterface | null;
        ownerAddress: PublicKey | null;
        ownerType: 'single' | 'token' | null;
        creatorAddress: PublicKey | null;
        creatorVerified: boolean | null;
        authorityAddress: PublicKey | null;
        grouping: [string, string] | null;
        delegateAddress: PublicKey | null;
        frozen: boolean | null;
        supply: number | null;
        supplyMint: PublicKey | null;
        compressed: boolean | null;
        compressible: boolean | null;
        royaltyTargetType: 'creators' | 'fanout' | 'single' | null;
        royaltyTarget: PublicKey | null;
        royaltyAmount: number | null;
        burnt: boolean | null;
        sortBy: DasApiParamAssetSortBy | null;
        limit: number | null;
        page: number;
        before: string | null;
        after: string | null;
        jsonUri: string | null;
        cursor: string | null;
        name: string | null;
        displayOptions: DisplayOptions;
        tokenType: TokenType | null;
      }>(
        'searchAssets',
        {
          negate: input.negate ?? null,
          conditionType: input.conditionType ?? null,
          interface: input.interface ?? null,
          ownerAddress: input.owner ?? null,
          ownerType: input.ownerType ?? null,
          creatorAddress: input.creator ?? null,
          creatorVerified: input.creatorVerified ?? null,
          authorityAddress: input.authority ?? null,
          grouping: input.grouping ?? null,
          delegateAddress: input.delegate ?? null,
          frozen: input.frozen ?? null,
          supply: input.supply ?? null,
          supplyMint: input.supplyMint ?? null,
          compressed: input.compressed ?? null,
          compressible: input.compressible ?? null,
          royaltyTargetType: input.royaltyModel ?? null,
          royaltyTarget: input.royaltyTarget ?? null,
          royaltyAmount: input.royaltyAmount ?? null,
          burnt: input.burnt ?? null,
          sortBy: input.sortBy ?? null,
          limit: input.limit ?? null,
          page: input.page ?? 1,
          before: input.before ?? null,
          after: input.after ?? null,
          jsonUri: input.jsonUri ?? null,
          cursor: input.cursor ?? null,
          name: input.name ?? null,
          displayOptions: input.displayOptions ?? {},
          tokenType: input.tokenType ?? null,
        }
      );
      if (!assetList) {
        throw new DasApiError('No assets found for the given search criteria');
      }
      return assetList;
    },
    getAssetSignatures: async (input: GetAssetSignaturesRpcInput) => {
      validatePagination(input.page, input.before, input.after);
      const signatures = await rpc.call<GetAssetSignaturesRpcResponse | null, {
        id: PublicKey | null;
        limit: number | null;
        page: number | null;
        before: string | null;
        after: string | null;
        treeId: PublicKey | null;
        leafIndex: number | null;
        cursor: string | null;
        sortDirection: 'asc' | 'desc' | null;
      }>(
        'getAssetSignaturesV2',
        {
          id: 'assetId' in input ? input.assetId ?? null : null,
          limit: input.limit ?? null,
          page: input.page ?? null,
          before: input.before ?? null,
          after: input.after ?? null,
          treeId: 'tree' in input ? input.tree ?? null : null,
          leafIndex: 'tree' in input ? input.leaf_index ?? null : null,
          cursor: input.cursor ?? null,
          sortDirection: input.sort_direction ?? null,
        }
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
