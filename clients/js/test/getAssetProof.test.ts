import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { GetAssetProofRpcResponse } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch the proof of a compressed asset by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT on devnet.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('Ez6ezCMkRaUkWS5v6WVcP7uuCWiKadr3W2dHFkoZmteW');

    // When we fetch the proof of the asset using its ID.
    const asset = await umi.rpc.getAssetProof(assetId);

    // Then we expect the following data.
    t.like(asset, <GetAssetProofRpcResponse>{
      root: 'EFCPJ6uVgvwrCgAK3zxYv5xfFNmvSFNfGguQBLjRdDf',
      proof: [
        '11111111111111111111111111111111',
        'Cf5tmmFZ4D31tviuJezHdFLf5WF7yFvzfxNyftKsqTwr',
        'DAbAU9srHpEUogXWuhy5VZ7g8UX9STymELtndcx1xgP1',
        '6DVZtacK87UT6bTCLc9MLNJCHqAaySsFSjeGEXymMUh',
        'GSz87YKd3YoZWcEKhnjSsYJwv8o5aWGdBdGGYUphRfTh',
      ],
      node_index: 40,
      leaf: 'ADh1Pe7CPB6JUTiPzHwoL1nJTDJA8zxeDMGPC5gYqSHE',
      tree_id: '5wu82msJUAs4WWx3XtNMD5u7nuJSnfJMratppsZ6kL27',
    });
  });
});
