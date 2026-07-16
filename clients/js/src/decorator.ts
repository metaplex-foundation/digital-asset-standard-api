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
  GetGroupingRpcInput,
  GetGroupingRpcResponse,
  GetNftEditionsRpcInput,
  GetNftEditionsRpcResponse,
  GetTokenAccountsRpcInput,
  GetTokenAccountsRpcResponse,
  DasApiNftEdition,
  DisplayOptions,
} from './types';

export type DasApiDecoratorOptions = {
  /**
   * Use Helius DAS parameter names (`mint`, `owner`) for methods where Helius
   * diverges from the Metaplex DAS specification (`mintAddress`, `ownerAddress`).
   */
  heliusCompatibility?: boolean;
};

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
   * Return grouping metadata for a group key/value pair.
   *
   * @param input the input parameters for the RPC call
   */
  getGrouping(input: GetGroupingRpcInput): Promise<GetGroupingRpcResponse>;

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

  /**
   * Return all printable editions for a master edition NFT mint
   *
   * @param input the input parameters for the RPC call
   */
  getNftEditions(
    input: GetNftEditionsRpcInput
  ): Promise<GetNftEditionsRpcResponse>;

  /**
   * Return a list of token accounts by owner or mint
   *
   * @param input the input parameters for the RPC call
   */
  getTokenAccounts(
    input: GetTokenAccountsRpcInput
  ): Promise<GetTokenAccountsRpcResponse>;
}

// Utility function to remove null and empty object properties
function cleanInput<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) =>
        value !== null &&
        value !== undefined &&
        (typeof value !== 'object' || (value && Object.keys(value).length > 0))
    )
  ) as Partial<T>;
}

function normalizeNftEdition(
  edition: Record<string, unknown>
): DasApiNftEdition {
  return {
    edition_address: edition.edition_address as string,
    edition_number: (edition.edition_number ?? edition.edition) as number,
    mint_address: (edition.mint_address ?? edition.mint) as string,
  };
}

function normalizeNftEditionsResponse(
  response: GetNftEditionsRpcResponse
): GetNftEditionsRpcResponse {
  return {
    ...response,
    editions: response.editions.map((edition) =>
      normalizeNftEdition(edition as unknown as Record<string, unknown>)
    ),
  };
}

export const createDasApiDecorator = (
  rpc: RpcInterface,
  options: DasApiDecoratorOptions = {}
): RpcInterface & DasApiInterface => {
  const { heliusCompatibility = false } = options;
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
      const displayOptions = Array.isArray(input) ? {} : input.displayOptions;

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
      const cleanedInput = cleanInput({
        authorityAddress: input.authority,
        sortBy: input.sortBy,
        limit: input.limit,
        page: input.page,
        before: input.before,
        after: input.after,
        displayOptions: input.displayOptions,
        cursor: input.cursor,
      });
      const assetList = await rpc.call<
        DasApiAssetList | null,
        typeof cleanedInput
      >('getAssetsByAuthority', cleanedInput);
      if (!assetList) {
        throw new DasApiError(
          `No assets found for authority: ${input.authority}`
        );
      }
      return assetList;
    },
    getAssetsByCreator: async (input: GetAssetsByCreatorRpcInput) => {
      validatePagination(input.page, input.before, input.after);
      const cleanedInput = cleanInput({
        creatorAddress: input.creator,
        onlyVerified: input.onlyVerified,
        sortBy: input.sortBy,
        limit: input.limit,
        page: input.page,
        before: input.before,
        after: input.after,
        displayOptions: input.displayOptions,
        cursor: input.cursor,
      });
      const assetList = await rpc.call<
        DasApiAssetList | null,
        typeof cleanedInput
      >('getAssetsByCreator', cleanedInput);
      if (!assetList) {
        throw new DasApiError(`No assets found for creator: ${input.creator}`);
      }
      return assetList;
    },
    getAssetsByGroup: async (input: GetAssetsByGroupRpcInput) => {
      validatePagination(input.page, input.before, input.after);
      const cleanedInput = cleanInput({
        groupKey: input.groupKey,
        groupValue: input.groupValue,
        sortBy: input.sortBy,
        limit: input.limit,
        page: input.page,
        before: input.before,
        after: input.after,
        displayOptions: input.displayOptions,
        cursor: input.cursor,
      });
      const assetList = await rpc.call<
        DasApiAssetList | null,
        typeof cleanedInput
      >('getAssetsByGroup', cleanedInput);
      if (!assetList) {
        throw new DasApiError(
          `No assets found for group: ${input.groupKey} => ${input.groupValue}`
        );
      }
      return assetList;
    },
    getGrouping: async (input: GetGroupingRpcInput) => {
      const cleanedInput = cleanInput({
        groupKey: input.groupKey,
        groupValue: input.groupValue,
      });
      const grouping = await rpc.call<
        GetGroupingRpcResponse | null,
        typeof cleanedInput
      >('getGrouping', cleanedInput);
      if (!grouping) {
        throw new DasApiError(
          `No grouping found for: ${input.groupKey} => ${input.groupValue}`
        );
      }
      return grouping;
    },
    getAssetsByOwner: async (input: GetAssetsByOwnerRpcInput) => {
      validatePagination(input.page, input.before, input.after);
      const cleanedInput = cleanInput({
        ownerAddress: input.owner,
        sortBy: input.sortBy,
        limit: input.limit,
        page: input.page,
        before: input.before,
        after: input.after,
        displayOptions: input.displayOptions,
        cursor: input.cursor,
      });
      const assetList = await rpc.call<
        DasApiAssetList | null,
        typeof cleanedInput
      >('getAssetsByOwner', cleanedInput);
      if (!assetList) {
        throw new DasApiError(`No assets found for owner: ${input.owner}`);
      }
      return assetList;
    },
    searchAssets: async (input: SearchAssetsRpcInput) => {
      validatePagination(input.page, input.before, input.after);
      const cleanedInput = cleanInput({
        negate: input.negate,
        conditionType: input.conditionType,
        interface: input.interface,
        ownerAddress: input.owner,
        ownerType: input.ownerType,
        creatorAddress: input.creator,
        creatorVerified: input.creatorVerified,
        authorityAddress: input.authority,
        grouping: input.grouping,
        delegateAddress: input.delegate,
        frozen: input.frozen,
        supply: input.supply,
        supplyMint: input.supplyMint,
        compressed: input.compressed,
        compressible: input.compressible,
        royaltyTargetType: input.royaltyModel,
        royaltyTarget: input.royaltyTarget,
        royaltyAmount: input.royaltyAmount,
        burnt: input.burnt,
        sortBy: input.sortBy,
        limit: input.limit,
        page: input.page,
        before: input.before,
        after: input.after,
        jsonUri: input.jsonUri,
        cursor: input.cursor,
        name: input.name,
        displayOptions: input.displayOptions,
        tokenType: input.tokenType,
        isAgent: input.isAgent,
        agentToken: input.agentToken,
        assetSigner: input.assetSigner,
      });
      const assetList = await rpc.call<
        DasApiAssetList | null,
        typeof cleanedInput
      >('searchAssets', cleanedInput);
      if (!assetList) {
        throw new DasApiError('No assets found for the given search criteria');
      }
      return assetList;
    },
    getAssetSignatures: async (input: GetAssetSignaturesRpcInput) => {
      validatePagination(input.page, input.before, input.after);
      const cleanedInput = cleanInput({
        id: input.assetId,
        limit: input.limit,
        page: input.page,
        before: input.before,
        after: input.after,
        tree: input.tree,
        leafIndex: input.leaf_index,
        cursor: input.cursor,
        sortDirection: input.sort_direction,
      });
      const signatures = await rpc.call<
        GetAssetSignaturesRpcResponse | null,
        typeof cleanedInput
      >('getAssetSignatures', cleanedInput);
      if (!signatures) {
        const identifier =
          'assetId' in input
            ? `asset: ${input.assetId}`
            : `tree: ${input.tree}, leaf_index: ${input.leaf_index}`;
        throw new DasApiError(`No signatures found for ${identifier}`);
      }
      return signatures;
    },
    getNftEditions: async (input: GetNftEditionsRpcInput) => {
      validatePagination(input.page, input.before, input.after);
      const cleanedInput = cleanInput({
        ...(heliusCompatibility
          ? { mint: input.mintAddress }
          : { mintAddress: input.mintAddress }),
        limit: input.limit,
        page: input.page,
        before: input.before,
        after: input.after,
        cursor: input.cursor,
      });
      const editions = await rpc.call<
        GetNftEditionsRpcResponse | null,
        typeof cleanedInput
      >('getNftEditions', cleanedInput);
      if (!editions) {
        throw new DasApiError(
          `No editions found for mint: ${input.mintAddress}`
        );
      }
      return normalizeNftEditionsResponse(editions);
    },
    getTokenAccounts: async (input: GetTokenAccountsRpcInput) => {
      validatePagination(input.page, input.before, input.after);
      const cleanedInput = cleanInput({
        ...(heliusCompatibility
          ? {
              owner: input.ownerAddress,
              mint: input.mintAddress,
            }
          : {
              ownerAddress: input.ownerAddress,
              mintAddress: input.mintAddress,
            }),
        limit: input.limit,
        page: input.page,
        before: input.before,
        after: input.after,
        cursor: input.cursor,
        options: input.options ?? input.displayOptions,
      });
      const tokenAccounts = await rpc.call<
        GetTokenAccountsRpcResponse | null,
        typeof cleanedInput
      >('getTokenAccounts', cleanedInput);
      const response = tokenAccounts ?? {
        total: 0,
        limit: input.limit ?? 0,
        token_accounts: [],
        errors: [],
      };
      return {
        ...response,
        errors: response.errors ?? [],
      };
    },
  };
};
