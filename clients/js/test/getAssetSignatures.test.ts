import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { GetAssetSignaturesRpcResponse } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch the proof of a compressed asset by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT on mainnet.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('5equc6uNZj75zb6yYLUUyy3WnAUmuuwmGZthz2oxUCtx');

    // When we fetch the proof of the asset using its ID.
    const signatures = await umi.rpc.getAssetSignatures(assetId);

    console.log(signatures);

    // Then we expect the following data.
    t.like(signatures, <GetAssetSignaturesRpcResponse>{});
  });
});
