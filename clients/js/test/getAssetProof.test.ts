import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { GetAssetProofRpcResponse } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch the proof of a compressed asset by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT on devnet.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA');

    // When we fetch the proof of the asset using its ID.
    const asset = await umi.rpc.getAssetProof(assetId);

    // Then we expect the following data.
    t.like(asset, <GetAssetProofRpcResponse>{
      root: 'ATo9owW1JofdTjhZNgMdYx8uS82mkExCSwCTvoyfTxmD',
      proof: [
        '7NCJtYyFmeG82fXeSW2DRfeTvitKeCs7e7hfAUowQtw5',
        '8QoG5BnZH9RVz2qLsKPEQ5jnAaCBu3kdRd9Hf4PgSwx9',
        'DAbAU9srHpEUogXWuhy5VZ7g8UX9STymELtndcx1xgP1',
        '3HCYqQRcQSChEuAw1ybNYHibrTNNjzbYzm56cmEmivB6',
        'GSz87YKd3YoZWcEKhnjSsYJwv8o5aWGdBdGGYUphRfTh',
      ],
      node_index: 32,
      leaf: 'FGWfA5v5SZnpe9r32NEvDyX9hLeVEoBf3GqEkHX6YK9w',
      tree_id: 'J1imb8C8SPzofrtgCxkN4nsKwHevzxgvHGeYBKFEDEmE',
    });
  });
});
