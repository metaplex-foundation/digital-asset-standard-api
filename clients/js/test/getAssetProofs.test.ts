import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { GetAssetProofsRpcResponse } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch multiple proofs of compressed assets by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT on mainnet.
    const umi = createUmi(endpoint.url);
    const assetIds = [
      publicKey('DNzerLDcC5apcAQQ2Wx3qfRK1NPP6g5Bsg11fPpWkRtA'),
      publicKey('AJKBo9b7ouxXWmSxWzByJyKqZMV7pRkYQTkMtA6hZkaV'),
    ];

    // When we fetch the proof of the asset using its ID.
    const assets = await umi.rpc.getAssetProofs(assetIds);

    // Then we expect the following data.
    t.like(assets[assetIds[0]], <GetAssetProofsRpcResponse>{
      root: '2ZE6VB4ueua2b9AM8Geif8LehjDmYBjZxDS6dxYLMo41',
      proof: [
        '11111111111111111111111111111111',
        'Cf5tmmFZ4D31tviuJezHdFLf5WF7yFvzfxNyftKsqTwr',
        'DAbAU9srHpEUogXWuhy5VZ7g8UX9STymELtndcx1xgP1',
        undefined,
        undefined,
      ],
      node_index: 8,
      leaf: '8KPK2EQ7g3edRv4au36fRNwFPcfAvP3HnH2VFqsBQje7',
      tree_id: 'Hw2qE4TKe8rt3VGWupLEH7wZtTrbBAzuU7LWBXfhGNMJ',
    });

    t.like(assets[assetIds[1]], <GetAssetProofsRpcResponse>{
      root: 'Zc1ryfD2naJwWL7qmSdg58aD7CsYn9bQGmgZJx5cZki',
      proof: [
        '11111111111111111111111111111111',
        'Cf5tmmFZ4D31tviuJezHdFLf5WF7yFvzfxNyftKsqTwr',
        'DAbAU9srHpEUogXWuhy5VZ7g8UX9STymELtndcx1xgP1',
        undefined,
        undefined,
      ],
      node_index: 8,
      leaf: 'CEzzR2XKcggEP9r24cJ6hXBm116cmmJQYA79iiy1MQVZ',
      tree_id: '33v2L6S9X1eZ7kHYLkwjHA6ZbTd7GJfYvUTLwDrvN8W2',
    });
  });
});
