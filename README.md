<h1 align="center">
  Metaplex Digital Asset Standard API
</h1>
<h3 align="center">
  (a.k.a. Metaplex Read API)
</h3>
<p align="center">
  Open-source specification for interacting with digital assets on Solana.
</p>
<p align="center">
  <img width="600" alt="Metaplex Digital Asset Standard" src="https://github.com/metaplex-foundation/digital-asset-standard-api/assets/729235/1494e063-cbe2-4db1-ab9a-c23b0bc4c55b" />
</p>
<p align="center">
  <a href="https://github.com/metaplex-foundation/digital-asset-standard-api/actions/workflows/main.yml"><img src="https://img.shields.io/github/actions/workflow/status/metaplex-foundation/digital-asset-standard-api/main.yml?logo=GitHub" /></a>
  <a href="https://www.npmjs.com/package/@metaplex-foundation/digital-asset-standard-api"><img src="https://img.shields.io/npm/v/%40metaplex-foundation%2Fdigital-asset-standard-api?logo=npm&color=377CC0" /></a>
</p>

## Overview

The state data of uncompressed NFTs is all stored in on-chain accounts. This is expensive at scale. Compressed NFTs save space by encoding the state data into an on-chain Merkle tree. The detailed account data is not stored on-chain, but in data stores managed by RPC providers. The Metaplex `D`igital `A`sset `S`tandard (DAS) API represents a unified interface for interacting with digital assets on Solana, supporting both standard ([Token Metadata](http://github.com/metaplex-foundation/mpl-token-metadata)) and compressed ([Bubblegum](http://github.com/metaplex-foundation/mpl-bubblegum)) assets.

The API defines a set of methods that RPCs implement in order to provide asset data. In the majority of cases, the data is indexed using [Metaplex Digital Asset RPC infrastructure](http://github.com/metaplex-foundation/digital-asset-rpc-infrastructure).

## Getting Started

The `@metaplex-foundation/digital-asset-standard-api` package can be use to interact with Metaplex DAS API:

1. First, if you are not already using Umi, [follow these instructions to install the Umi framework](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md).
2. Next, install this library using the package manager of your choice.

   ```sh
   npm install @metaplex-foundation/digital-asset-standard-api
   ```

3. Finally, register the library with your Umi instance.

   ```ts
   import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
   umi.use(dasApi());
   ```

Examples are provided [here](#examples) and you can learn more about this library's API by reading its generated [TypeDoc documentation](https://digital-asset-standard-api-js-docs.vercel.app).

The plugin can be used with any RPC that supports the Metaplex DAS API specification – the following RPCs (in alphabetical order) support the specification:

- [Aura](https://aura.metaplex.com/)
- [Helius](https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api)
- [Hello Moon](https://docs.hellomoon.io/reference/rpc-endpoint-for-digital-asset-standard)
- [QuickNode](https://marketplace.quicknode.com/add-on/metaplex-digital-asset-standard-api)
- [Shyft](https://docs.shyft.to/solana-rpcs-das-api/compression-das-api)
- [Triton](https://docs.triton.one/rpc-pool/metaplex-digital-assets-api)

> **Note**
> You might need to contact your RPC provider to "enable" the DAS API on your endpoint.

## Methods

> 💡 You can test each method of the API using the [OpenRPC playground](https://playground.open-rpc.org/?url=https://raw.githubusercontent.com/metaplex-foundation/digital-asset-standard-api/main/specification/metaplex-das-api.json).

| Name                   | Description                                                     |           Example           |
| ---------------------- | --------------------------------------------------------------- | :-------------------------: |
| `getAsset`             | Return the metadata information of a compressed/standard asset  |       [➡](#-getasset)       |
| `getAssets`            | Return the metadata information of a compressed/standard assets |      [➡](#-getassets)       |
| `getAssetProof`        | Return the merkle tree proof information for a compressed asset |    [➡](#-getassetproof)     |
| `getAssetProofs`       | Return the merkle tree proof information for compressed assets  |    [➡](#-getassetproofs)    |
| `getAssetsByOwner`     | Return the list of assets given an owner address                |   [➡](#-getassetsbyowner)   |
| `getAssetsByAuthority` | Return the list of assets given an authority address            | [➡](#-getassetsbyauthority) |
| `getAssetsByCreator`   | Return the list of assets given a creator address               |  [➡](#-getassetsbycreator)  |
| `getAssetsByGroup`     | Return the list of assets given a group (key, value) pair       |   [➡](#-getassetsbygroup)   |
| `getAssetSignatures`   | Return the transaction signatures for a compressed asset        |  [➡](#-getassetsignatures)  |
| `searchAssets`         | Return the list of assets given a search criteria               |     [➡](#-searchassets)     |

## Examples

> ⚠️ You should replace the `<ENDPOINT>` with the RPC endpoint to use.

#### 📌 `getAsset`

<details>
  <summary>parameters</summary>

| Name | Required | Description          |
| ---- | :------: | -------------------- |
| `id` |    ✅    | The id of the asset. |

</details>

<details>
  <summary>typescript</summary>

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

const umi = createUmi("<ENDPOINT>").use(dasApi());
const assetId = publicKey("8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV");

const asset = await umi.rpc.getAsset(assetId);
console.log(asset);
```

</details>

<details>
  <summary>curl</summary>

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAsset",
    "params": [
      "8vw7tdLGE3FBjaetsJrZAarwsbc8UESsegiLyvWXxs5A"
    ],
    "id": 0
}'
```

</details>

#### 📌 `getAssets`

<details>
  <summary>parameters</summary>

| Name | Required | Description          |
| ---- | :------: | -------------------- |
| `ids` |    ✅    | The ids of the assets. |

</details>

<details>
  <summary>typescript</summary>

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

const umi = createUmi("<ENDPOINT>").use(dasApi());
const assetIds = [
      publicKey('8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV'),
      publicKey('5HsEEPqaMKvneyoxMEEfFh47CUrWTZruhrECg4Fsn4Go'),
    ];

const asset = await umi.rpc.getAssets(assetIds);
console.log(asset);
```

</details>

<details>
  <summary>curl</summary>

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssets",
    "params": [
      "8vw7tdLGE3FBjaetsJrZAarwsbc8UESsegiLyvWXxs5A",
      "5ja3EvVuEu5rXgtYE3LXKG84s7Pmy5siFfYbcopMc2Dx"
    ],
    "id": 0
}'
```

</details>

#### 📌 `getAssetProof`

<details>
  <summary>parameters</summary>

| Name | Required | Description          |
| ---- | :------: | -------------------- |
| `id` |    ✅    | The id of the asset. |

</details>

<details>
  <summary>typescript</summary>

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

const umi = createUmi("<ENDPOINT>").use(dasApi());
const assetId = publicKey("Ez6ezCMkRaUkWS5v6WVcP7uuCWiKadr3W2dHFkoZmteW");

const proof = await umi.rpc.getAssetProof(assetId);
console.log(proof);
```

</details>

<details>
  <summary>curl</summary>

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetProof",
    "params": [
      "Ez6ezCMkRaUkWS5v6WVcP7uuCWiKadr3W2dHFkoZmteW"
    ],
    "id": 0
}'
```

</details>

#### 📌 `getAssetProofs`

<details>
  <summary>parameters</summary>

| Name | Required | Description          |
| ---- | :------: | -------------------- |
| `ids` |    ✅    | The ids of the assets. |

</details>

<details>
  <summary>typescript</summary>

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

const umi = createUmi("<ENDPOINT>").use(dasApi());
const assetIds = [
      publicKey('8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV'),
      publicKey('5HsEEPqaMKvneyoxMEEfFh47CUrWTZruhrECg4Fsn4Go'),
    ];

const proof = await umi.rpc.getAssetProofs(assetIds);
console.log(proof);
```

</details>

<details>
  <summary>curl</summary>

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetProofs",
    "params": [
      "8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV",
      "5HsEEPqaMKvneyoxMEEfFh47CUrWTZruhrECg4Fsn4Go"
    ],
    "id": 0
}'
```

</details>

#### 📌 `getAssetsByAuthority`

<details>
  <summary>parameters</summary>

| Name               | Required | Description                                                                                                                                                                                                               |
| ------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authorityAddress` |    ✅    | The address of the authority of the assets.                                                                                                                                                                               |
| `sortBy`           |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <vlaue> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]` |
| `limit`            |          | The maximum number of assets to retrieve.                                                                                                                                                                                 |
| `page`             |          | The index of the "page" to retrieve.                                                                                                                                                                                      |
| `before`           |          | Retrieve assets before the specified ID.                                                                                                                                                                                  |
| `after`            |          | Retrieve assets after the specified ID.                                                                                                                                                                                   |

</details>

<details>
  <summary>typescript</summary>

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

const umi = createUmi("<ENDPOINT>").use(dasApi());
const authority = publicKey("mRdta4rc2RtsxEUDYuvKLamMZAdW6qHcwuq866Skxxv");

const assets = await umi.rpc.getAssetsByAuthority({ authority });
console.log(assets.items.length > 0);
```

</details>

<details>
  <summary>curl</summary>

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetsByAuthority",
    "params": {
        "authorityAddress": "mRdta4rc2RtsxEUDYuvKLamMZAdW6qHcwuq866Skxxv",
        "page": 1
    },
    "id": 0
}'
```

</details>

#### 📌 `getAssetsByCreator`

<details>
  <summary>parameters</summary>

| Name             | Required | Description                                                                                                                                                                                                               |
| ---------------- | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `creatorAddress` |    ✅    | The address of the creator of the assets.                                                                                                                                                                                 |
| `onlyVerified`   |          | Indicates whether to retrieve only verified assets or not.                                                                                                                                                                |
| `sortBy`         |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <vlaue> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]` |
| `limit`          |          | The maximum number of assets to retrieve.                                                                                                                                                                                 |
| `page`           |          | The index of the "page" to retrieve.                                                                                                                                                                                      |
| `before`         |          | Retrieve assets before the specified ID.                                                                                                                                                                                  |
| `after`          |          | Retrieve assets after the specified ID.                                                                                                                                                                                   |

</details>

<details>
  <summary>typescript</summary>

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

const umi = createUmi("<ENDPOINT>").use(dasApi());
const creator = publicKey("D3XrkNZz6wx6cofot7Zohsf2KSsu2ArngNk8VqU9cTY3");

const assets = await umi.rpc.getAssetsByCreator({
  creator,
  onlyVerified: false,
  limit: 10,
});
console.log(assets.items.length > 0);
```

</details>

<details>
  <summary>curl</summary>

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetsByCreator",
    "params": {
        "creatorAddress": "D3XrkNZz6wx6cofot7Zohsf2KSsu2ArngNk8VqU9cTY3",
        "onlyVerified": false,
        "limit": 10,
        "page": 1
    },
    "id": 0
}'
```

</details>

#### 📌 `getAssetsByGroup`

<details>
  <summary>parameters</summary>

| Name         | Required | Description                                                                                                                                                                                                               |
| ------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `groupKey`   |    ✅    | The key of the group (e.g., `"collection"`).                                                                                                                                                                              |
| `groupValue` |    ✅    | The value of the group.                                                                                                                                                                                                   |
| `sortBy`     |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <vlaue> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]` |
| `limit`      |          | The maximum number of assets to retrieve.                                                                                                                                                                                 |
| `page`       |          | The index of the "page" to retrieve.                                                                                                                                                                                      |
| `before`     |          | Retrieve assets before the specified ID.                                                                                                                                                                                  |
| `after`      |          | Retrieve assets after the specified ID.                                                                                                                                                                                   |

</details>

<details>
  <summary>typescript</summary>

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

const umi = createUmi("<ENDPOINT>").use(dasApi());

const assets = await umi.rpc.getAssetsByGroup({
  groupKey: "collection",
  groupValue: "J2ZfLdQsaZ3GCmbucJef3cPnPwGcgjDW1SSYtMdq3L9p",
});
console.log(assets.items.length > 0);
```

</details>

<details>
  <summary>curl</summary>

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetsByGroup",
    "params": {
        "groupKey": "collection",
        "groupValue": "J2ZfLdQsaZ3GCmbucJef3cPnPwGcgjDW1SSYtMdq3L9p",
        "page": 1
    },
    "id": 0
}'
```

</details>

#### 📌 `getAssetsByOwner`

<details>
  <summary>parameters</summary>

| Name           | Required | Description                                                                                                                                                                                                               |
| -------------- | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ownerAddress` |    ✅    | The address of the owner of the assets.                                                                                                                                                                                   |
| `sortBy`       |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <vlaue> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]` |
| `limit`        |          | The maximum number of assets to retrieve.                                                                                                                                                                                 |
| `page`         |          | The index of the "page" to retrieve.                                                                                                                                                                                      |
| `before`       |          | Retrieve assets before the specified ID.                                                                                                                                                                                  |
| `after`        |          | Retrieve assets after the specified ID.                                                                                                                                                                                   |

</details>

<details>
  <summary>typescript</summary>

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

const umi = createUmi("<ENDPOINT>").use(dasApi());
const owner = publicKey("N4f6zftYsuu4yT7icsjLwh4i6pB1zvvKbseHj2NmSQw");

const assets = await umi.rpc.getAssetsByOwner({
  owner,
  limit: 10,
});
console.log(assets.items.length > 0);
```

</details>

<details>
  <summary>curl</summary>

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetsByOwner",
    "params": {
        "ownerAddress": "N4f6zftYsuu4yT7icsjLwh4i6pB1zvvKbseHj2NmSQw",
        "limit": 10,
        "page": 1
    },
    "id": 0
}'
```

</details>

#### 📌 `getAssetSignatures`

<details>
  <summary>parameters</summary>

| Name            | Required | Description                                                                                                                                                                                                                |
| --------------- | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assetId`       |    ✅ (or tree + leafIndex)   | The id of the asset.                                                                                                                                                                                                       |
| `tree`          |    ✅ (or assetId)    | The tree corresponding to the leaf.                                                                                                                                                                                        |
| `leafIndex`     |    ✅ (or assetId)    | The leaf index of the asset.                                                                                                                                                                                               |
| `limit`         |          | The maximum number of signatures to retrieve.                                                                                                                                                                              |
| `page`          |          | The index of the "page" to retrieve.                                                                                                                                                                                       |
| `before`        |          | Retrieve signatures before the specified signature.                                                                                                                                                                        |
| `after`         |          | Retrieve signatures after the specified signature.                                                                                                                                                                         |
| `cursor`        |          | The cursor of the signatures.                                                                                                                                                                                              |
| `sortDirection` |          | Sort direction. can be one of these values: `["asc", "desc"]`                                                                                                                                                                                                           |

</details>

<details>
  <summary>typescript</summary>

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

const umi = createUmi("<ENDPOINT>").use(dasApi());

const assets = await umi.rpc.getAssetSignatures({
  assetId: publicKey("GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA"),
});
console.log(assets.items.length == 1);
```

</details>

<details>
  <summary>curl</summary>

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetSignaturesV2",
    "params": {
        "assetId": "GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA"
    },
    "id": 0
}'
```

</details>

#### 📌 `searchAssets`

<details>
  <summary>parameters</summary>

| Name                | Required | Description                                                                                                                                                                                                                |
| ------------------- | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `negate`            |          | Indicates whether the search criteria should be inverted or not.                                                                                                                                                           |
| `conditionType`     |          | Indicates whether to retrieve all (`"all"`) or any (`"any"`) asset that matches the search criteria.                                                                                                                       |
| `interface`         |          | The interface value (one of `["V1_NFT", "V1_PRINT" "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"]`).                                                                                         |
| `ownerAddress`      |          | The address of the owner.                                                                                                                                                                                                  |
| `ownerType`         |          | Type of ownership `["single", "token"]`.                                                                                                                                                                                   |
| `creatorAddress`    |          | The address of the creator.                                                                                                                                                                                                |
| `creatorVerified`   |          | Indicates whether the creator must be verified or not.                                                                                                                                                                     |
| `authorityAddress`  |          | The address of the authority.                                                                                                                                                                                              |
| `grouping`          |          | The grouping `["key", "value"]` pair.                                                                                                                                                                                      |
| `delegateAddress`   |          | The address of the delegate.                                                                                                                                                                                               |
| `frozen`            |          | Indicates whether the asset is frozen or not.                                                                                                                                                                              |
| `supply`            |          | The supply of the asset.                                                                                                                                                                                                   |
| `supplyMint`        |          | The address of the supply mint.                                                                                                                                                                                            |
| `compressed`        |          | Indicates whether the asset is compressed or not.                                                                                                                                                                          |
| `compressible`      |          | Indicates whether the asset is compressible or not.                                                                                                                                                                        |
| `royaltyTargetType` |          | Type of royalty `["creators", "fanout", "single"]`.                                                                                                                                                                        |
| `royaltyTarget`     |          | The target address for royalties.                                                                                                                                                                                          |
| `royaltyAmount`     |          | The royalties amount.                                                                                                                                                                                                      |
| `burnt`             |          | Indicates whether the asset is burnt or not.                                                                                                                                                                               |
| `sortBy`            |          | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <vlaue> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]`. |
| `limit`             |          | The maximum number of assets to retrieve.                                                                                                                                                                                  |
| `page`              |          | The index of the "page" to retrieve.                                                                                                                                                                                       |
| `before`            |          | Retrieve assets before the specified ID.                                                                                                                                                                                   |
| `after`             |          | Retrieve assets after the specified ID.                                                                                                                                                                                    |
| `jsonUri`           |          | The value for the JSON URI.                                                                                                                                                                                                |

</details>

<details>
  <summary>typescript</summary>

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

const umi = createUmi("<ENDPOINT>").use(dasApi());

const assets = await umi.rpc.searchAssets({
  owner: publicKey("N4f6zftYsuu4yT7icsjLwh4i6pB1zvvKbseHj2NmSQw"),
  jsonUri:
    "https://arweave.net/c9aGs5fOk7gD4wWnSvmzeqgtfxAGRgtI1jYzvl8-IVs/chiaki-violet-azure-common.json",
});
console.log(assets.items.length == 1);
```

</details>

<details>
  <summary>curl</summary>

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "searchAssets",
    "params": {
        "ownerAddress": "N4f6zftYsuu4yT7icsjLwh4i6pB1zvvKbseHj2NmSQw",
        "jsonUri": "https://arweave.net/c9aGs5fOk7gD4wWnSvmzeqgtfxAGRgtI1jYzvl8-IVs/chiaki-violet-azure-common.json",
        "page": 1
    },
    "id": 0
}'
```

</details>

## Testing Endpoints

The tests included in this repository can be run locally to test different endpoints. From the `clients/js` folder, follow the steps below to setup the environment to run the tests:

1. Make a copy of file `.env.example` and name it `.env`.
2. Edit the `.env` file and include a line specifying your endpoint:

   ```bash
   DAS_API_MYENDPOINT="<URL>"
   ```

   where `MYENDPOINT` is the name of your endpoint (this can be any name) and `<URL>` is the URL of your endpoint.
3. [Ensure you have pnpm installed](https://pnpm.io/installation) and run the following command to install the dependencies:

   ```bash
   pnpm install
   ```

4. Build and run the tests:

   ```bash
   pnpm build && pnpm test
   ```
