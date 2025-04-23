import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { GetAssetProofRpcResponse } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch the proof of a compressed asset by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT on devnet.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('DNzerLDcC5apcAQQ2Wx3qfRK1NPP6g5Bsg11fPpWkRtA');

    // When we fetch the proof of the asset using its ID.
    const asset = await umi.rpc.getAssetProof(assetId);

    // Then we expect the following data.
    t.like(asset, <GetAssetProofRpcResponse>{
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
  });
});
