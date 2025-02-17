import { Nullable, PublicKey } from '@metaplex-foundation/umi';

// ---------------------------------------- //
// RPC input.                               //
// ---------------------------------------- //

export type GetAssetsByAuthorityRpcInput = {
  /**
   * The address of the authority of the assets.
   */
  authority: PublicKey;
} & Pagination;

export type GetAssetsByCreatorRpcInput = {
  /**
   * The address of the creator of the assets.
   */
  creator: PublicKey;

  /**
   * Indicates whether to retrieve only verified assets or not.
   */
  onlyVerified: boolean;
} & Pagination;

export type GetAssetsByGroupRpcInput = {
  /**
   * The key of the group (e.g., `"collection"`).
   */
  groupKey: DasApiPropGroupKey;

  /**
   * The value of the group
   */
  groupValue: string;
} & Pagination;

export type GetAssetsByOwnerRpcInput = {
  /**
   * The address of the owner of the assets.
   */
  owner: PublicKey;
} & Pagination;

export type SearchAssetsRpcInput = {
  /**
   * Indicates whether the search criteria should be inverted or not.
   */
  negate?: Nullable<boolean>;

  /**
   * Indicates whether to retrieve all or any asset that matches the search criteria.
   */
  conditionType?: Nullable<'all' | 'any'>;

  /**
   * The interface value of the asset.
   */
  interface?: Nullable<DasApiAssetInterface>;

  /**
   * The value for the JSON URI.
   */
  jsonUri?: Nullable<string>;

  /**
   * The address of the owner.
   */
  owner?: Nullable<PublicKey>;

  /**
   * Type of ownership.
   */
  ownerType?: Nullable<'single' | 'token'>;

  /**
   * The address of the creator.
   */
  creator?: Nullable<PublicKey>;

  /**
   * Indicates whether the creator must be verified or not.
   */
  creatorVerified?: Nullable<boolean>;

  /**
   * The address of the authority.
   */
  authority?: Nullable<PublicKey>;

  /**
   * The grouping (`key`, `value`) pair.
   */
  grouping?: Nullable<[string, string]>;

  /**
   * The address of the delegate.
   */
  delegate?: Nullable<PublicKey>;

  /**
   * Indicates whether the asset is frozen or not.
   */
  frozen?: Nullable<boolean>;

  /**
   * The supply of the asset.
   */
  supply?: Nullable<number>;

  /**
   * The address of the supply mint.
   */
  supplyMint?: Nullable<PublicKey>;

  /**
   * Indicates whether the asset is compressed or not.
   */
  compressed?: Nullable<boolean>;

  /**
   * Indicates whether the asset is compressible or not.
   */
  compressible?: Nullable<boolean>;

  /**
   * Type of royalty.
   */
  royaltyModel?: Nullable<'creators' | 'fanout' | 'single'>;

  /**
   * The target address for royalties.
   */
  royaltyTarget?: Nullable<PublicKey>;

  /**
   * The royalties amount.
   */
  royaltyAmount?: Nullable<number>;

  /**
   * Indicates whether the asset is burnt or not.
   */
  burnt?: Nullable<boolean>;
} & Pagination;

// ---------------------------------------- //
// Result types.                            //
// ---------------------------------------- //

/**
 * Representation of an asset.
 */
export type DasApiAsset = {
  /**
   * The asset interface.
   */
  interface: DasApiAssetInterface;

  /**
   * The asset Id.
   */
  id: PublicKey;

  /**
   * The asset content.
   */
  content: DasApiAssetContent;

  /**
   * List of authorities.
   */
  authorities: Array<DasApiAssetAuthority>;

  /**
   * Compression information.
   */
  compression: DasApiAssetCompression;

  /**
   * Grouping information.
   */
  grouping: Array<DasApiAssetGrouping>;

  /**
   * Royalty information.
   */
  royalty: DasApiAssetRoyalty;

  /**
   * List of creators.
   */
  creators: Array<DasApiAssetCreator>;

  /**
   * Ownership information.
   */
  ownership: DasApiAssetOwnership;

  /**
   * Uses information.
   */
  uses?: DasApiUses;

  /**
   * Supply information.
   */
  supply: DasApiAssetSupply;

  /**
   * Indicates whether the asset's metadata is mutable or not.
   */
  mutable: boolean;

  /**
   * Indicates whether the asset is burnt or not.
   */
  burnt: boolean;
} & DasApiCoreAssetFields;

/**
 * Optional fields on an asset if the interface is for Core (i.e. interface is 'MplCoreAsset' or 'MplCoreCollection')
 * It is recommended to use the mpl-core-das package along with this one to convert the types
 * to be consistent with mpl-core (e.g. AssetV1)
 */
export type DasApiCoreAssetFields = {
  /**
   * Plugins active on the asset or collection
   */
  plugins?: Record<string, any>;
  /**
   * External plugins active on the asset or collection
   */
  external_plugins?: Record<string, any>[];
  /**
   * Plugins on the asset/collection that were unknown at the time of indexing.
   * Contact your DAS provider to update their core indexing version if this field is being populated.
   * If you have an up-to-date version of mpl-core-das installed, that library will also try to deserialize the plugin
   */
  unknown_plugins?: Record<string, any>[];
  /**
   * External plugin adapters on the asset/collection that were unknown at the time of indexing.
   * Contact your DAS provider to update their core indexing version if this field is being populated.
   * If you have an up-to-date version of mpl-core-das installed, that library will also try to deserialize the plugin
   */
  unknown_external_plugins?: Record<string, any>[];
  /**
   * Additional fields that are indexed for Core assets or collections
   */
  mpl_core_info?: {
    /**
     * Number of assets minted to this collection
     * Only applicable for collections
     */
    num_minted?: number;
    /**
     * Current number of assets in this collection
     * Only applicable for collections
     */
    current_size?: number;
    plugins_json_version: number;
  };
};

/**
 * Representation of a list of assets.
 */
export type DasApiAssetList = {
  /**
   * total number of assets in the list.
   */
  total: number;

  /**
   * Limit of assets used to create the list. When the `total` value is
   * lower than the `limit`, it means that there are no more assets to be
   * retrieved.
   */
  limit: number;

  /**
   * Listing of individual assets.
   */
  items: Array<DasApiAsset>;

  /**
   * Additional information about the list.
   */
  [key: string]: unknown;
};

// ---------------------------------------- //
// Helper types.                            //
// ---------------------------------------- //

/**
 * Definition of the pagination parameters.
 */
type Pagination = {
  /**
   * Sorting criteria.
   */
  sortBy?: Nullable<DasApiParamAssetSortBy>;

  /**
   * The maximum number of assets to retrieve.
   */
  limit?: Nullable<number>;

  /**
   * The index of the `"page"` to retrieve. The first page has index `1`.
   */
  page?: Nullable<number>;

  /**
   * Retrieve assets before the specified `ID` value.
   */
  before?: Nullable<string>;

  /**
   * Retrieve assets after the specified `ID` value.
   */
  after?: Nullable<string>;
};

/**
 * Sorting criteria.
 */
type DasApiParamAssetSortBy = {
  sortBy: 'created' | 'updated' | 'recent_action' | 'id' | 'none';
  sortDirection: 'asc' | 'desc';
};

export type DasApiAssetInterface =
  | 'V1_NFT'
  | 'V1_PRINT'
  | 'LEGACY_NFT'
  | 'V2_NFT'
  | 'FungibleAsset'
  | 'Custom'
  | 'Identity'
  | 'Executable'
  | 'ProgrammableNFT'
  | 'MplCoreAsset'
  | 'MplCoreCollection';

export type DasApiAssetContent = {
  json_uri: string;
  files?: Array<{
    uri?: string;
    mime?: string;
    [key: string]: unknown;
  }>;
  metadata: DasApiMetadata;
  links?: Array<{
    [key: string]: unknown;
  }>;
};

export type DasApiAssetAuthority = {
  address: PublicKey;
  scopes: DasApiAuthorityScope[];
};

export type DasApiAssetCompression = {
  eligible: boolean;
  compressed: boolean;
  data_hash: PublicKey;
  creator_hash: PublicKey;
  asset_hash: PublicKey;
  tree: PublicKey;
  seq: number;
  leaf_id: number;
};

export type DasApiAssetOwnership = {
  frozen: boolean;
  delegated: boolean;
  delegate: PublicKey | null;
  ownership_model: 'single' | 'token';
  owner: PublicKey;
};

export type DasApiAssetSupply = {
  print_max_supply: number;
  print_current_supply: number;
  edition_nonce: number | null;
};

export type DasApiAssetRoyalty = {
  royalty_model: 'creators' | 'fanout' | 'single';
  target: PublicKey | null;
  percent: number;
  basis_points: number;
  primary_sale_happened: boolean;
  locked: boolean;
};

export type DasApiAssetCreator = {
  address: PublicKey;
  share: number;
  verified: boolean;
};

export type DasApiPropGroupKey = 'collection';

export type DasApiAssetGrouping = {
  group_key: DasApiPropGroupKey;
  group_value: string;
};

export type DasApiAuthorityScope =
  | 'full'
  | 'royalty'
  | 'metadata'
  | 'extension';

export type DasApiMetadata = {
  name: string;
  symbol: string;
  description?: string;
  token_standard?: string;
  attributes?: Array<{
    trait_type?: string;
    value?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

export type DasApiUses = {
  use_method: 'burn' | 'multiple' | 'single';
  remaining: number;
  total: number;
};

export type GetAssetProofRpcResponse = {
  root: PublicKey;
  proof: PublicKey[];
  node_index: number;
  leaf: PublicKey;
  tree_id: PublicKey;
};

export type GetAssetProofsRpcResponse = Record<
  PublicKey,
  GetAssetProofRpcResponse
>;

export type GetAssetSignaturesRpcInput = {
  /**
   * The maximum number of assets to retrieve.
   */
  limit?: Nullable<number>;

  /**
   * The page number of the signatures.
   */
  page?: Nullable<number>;

  /**
   * Retrieve signatures before the specified `ID` value.
   */
  before?: Nullable<string>;

  /**
   * Retrieve signatures after the specified `ID` value.
   */
  after?: Nullable<string>;

  /**
   *
   */
  cursor?: Nullable<string>;

  /**
   * The sort direction.
   */
  sort_direction?: Nullable<'asc' | 'desc'>;
} & (
  | {
      /**
       * The Asset ID to retrieve signatures for.
       */
      assetId: PublicKey;
      tree?: never;
      leaf_index?: never;
    }
  | {
      /**
       * The tree ID to retrieve signatures for.
       */
      tree: PublicKey;
      /**
       * The leaf index to retrieve signatures for.
       */
      leaf_index: number;
      assetId?: never;
    }
);

export type DasApiTransactionSignature = {
  signature: string;
  instruction: string;
  slot: number;
};

export type GetAssetSignaturesRpcResponse = {
  /**
   * total number of signatures in the list.
   */
  total: number;

  /**
   * Limit of signatures used to create the list. When the `total` value is
   * lower than the `limit`, it means that there are no more signatures to be
   * retrieved.
   */
  limit: number;

  before: string;
  after: string;

  /**
   * The page number of the signatures.
   */
  page?: number;

  /**
   * List of individual signatures.
   */
  items: DasApiTransactionSignature[];
};

