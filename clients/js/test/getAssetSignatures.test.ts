import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DasApiTransactionSignature } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch the signatures of a compressed asset by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT on mainnet.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('GGRbPQhwmo3dXBkJSAjMFc1QYTKGBt8qc11tTp3LkEKA');

    // When we fetch the Signatures for the asset.
    const signatures = await umi.rpc.getAssetSignatures({ assetId });

    // Then we expect to find 2 signatures.
    t.is(signatures.total, 2);
    t.is(signatures.limit, 1000);
    t.is(signatures.items.length, 2);
    t.like(signatures.items[0], <DasApiTransactionSignature>{
      signature:
        '3Ki9QJTC2V1oNhkkhvJAJ4DEBRdMMrvKqctsyPhGL5JGkZz72xAsgTQh4vAEuJNtkxTxdmWg7RhkSXwU2JNRdSVh',
      instruction: 'MintToCollectionV1',
      slot: 356098299,
    });
    t.like(signatures.items[1], <DasApiTransactionSignature>{
      signature:
        '4rNhZukEBfuGxWxesRgStu1PqvStycu1fhNiftXVUcCygazXLpz6BubNCMywBW9eQLKtLa58FSqgyjDxHSTuFYy8',
      instruction: 'CreateTree',
      slot: 356098214,
    });
  });

  test(`it can fetch the signatures of a compressed asset by leaf index and tree (${endpoint.name})`, async (t) => {
    // Given a minted NFT on mainnet.
    const umi = createUmi(endpoint.url);
    const tree = publicKey('J1imb8C8SPzofrtgCxkN4nsKwHevzxgvHGeYBKFEDEmE');
    const leaf_index = 0;
    // When we fetch the Signatures for the asset.
    const signatures = await umi.rpc.getAssetSignatures({ tree, leaf_index });

    // Then we expect to find 2 signatures.
    t.is(signatures.total, 2);
    t.is(signatures.limit, 1000);
    t.is(signatures.items.length, 2);
    t.like(signatures.items[0], <DasApiTransactionSignature>{
      signature:
        '3Ki9QJTC2V1oNhkkhvJAJ4DEBRdMMrvKqctsyPhGL5JGkZz72xAsgTQh4vAEuJNtkxTxdmWg7RhkSXwU2JNRdSVh',
      instruction: 'MintToCollectionV1',
      slot: 356098299,
    });
    t.like(signatures.items[1], <DasApiTransactionSignature>{
      signature:
        '4rNhZukEBfuGxWxesRgStu1PqvStycu1fhNiftXVUcCygazXLpz6BubNCMywBW9eQLKtLa58FSqgyjDxHSTuFYy8',
      instruction: 'CreateTree',
      slot: 356098214,
    });
  });
});
