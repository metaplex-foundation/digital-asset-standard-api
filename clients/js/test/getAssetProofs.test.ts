import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { GetAssetProofsRpcResponse } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch multiple proofs of compressed assets by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT on mainnet.
    const umi = createUmi(endpoint.url);
    const assetIds = [
      publicKey('GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA'),
      publicKey('ELDjRRs5Wb478K4h3B5bMPEhqFD8FvoET5ctHku5uiYi'),
    ];

    // When we fetch the proof of the asset using its ID.
    const assets = await umi.rpc.getAssetProofs(assetIds);

    // Then we expect the following data.
    t.like(assets[assetIds[0]], <GetAssetProofsRpcResponse>{
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

    t.like(assets[assetIds[1]], <GetAssetProofsRpcResponse>{
      root: 'EH7KDynGRdQWh4YF91i5euceg6ucZEbXnuyiqmPu8ZWb',
      proof: [
        'FGWfA5v5SZnpe9r32NEvDyX9hLeVEoBf3GqEkHX6YK9w',
        'Cf5tmmFZ4D31tviuJezHdFLf5WF7yFvzfxNyftKsqTwr',
        'DAbAU9srHpEUogXWuhy5VZ7g8UX9STymELtndcx1xgP1',
        '3HCYqQRcQSChEuAw1ybNYHibrTNNjzbYzm56cmEmivB6',
        'GSz87YKd3YoZWcEKhnjSsYJwv8o5aWGdBdGGYUphRfTh',
      ],
      node_index: 33,
      leaf: '7NCJtYyFmeG82fXeSW2DRfeTvitKeCs7e7hfAUowQtw5',
      tree_id: 'J1imb8C8SPzofrtgCxkN4nsKwHevzxgvHGeYBKFEDEmE',
    });
  });
});
