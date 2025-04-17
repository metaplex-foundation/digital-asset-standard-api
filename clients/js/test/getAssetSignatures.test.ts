import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DasApiTransactionSignature } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch the signatures of a compressed asset by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT on mainnet.
    const umi = createUmi(endpoint.url);
    const assetId = publicKey('DNzerLDcC5apcAQQ2Wx3qfRK1NPP6g5Bsg11fPpWkRtA');

    // When we fetch the Signatures for the asset.
    const signatures = await umi.rpc.getAssetSignatures({ assetId });

    // Then we expect to find 2 signatures.
    t.is(signatures.total, 1);
    t.is(signatures.limit, 1000);
    t.like(signatures.items[0], <DasApiTransactionSignature>{
      signature:
        '2LzGEe1JZcf5SqtGhajrusvfRWSeL3Fm4sduQC1gbfPgMyQySf2tqS1yU5yTiHEutdUZkswHXHg6zzyjK6Vg92GA',
      instruction: 'MintToCollectionV1',
      slot: 356098299,
    });
  });

  test(`it can fetch the signatures of a compressed asset by leaf index and tree (${endpoint.name})`, async (t) => {
    // Given a minted NFT on mainnet.
    const umi = createUmi(endpoint.url);
    const tree = publicKey('Hw2qE4TKe8rt3VGWupLEH7wZtTrbBAzuU7LWBXfhGNMJ');
    const leaf_index = 0;
    // When we fetch the Signatures for the asset.
    const signatures = await umi.rpc.getAssetSignatures({ tree, leaf_index });

    // Then we expect to find 2 signatures.
    t.is(signatures.total, 2);
    t.is(signatures.limit, 1000);
    t.is(signatures.items.length, 2);
    t.like(signatures.items[0], <DasApiTransactionSignature>{
      signature:
        '2LzGEe1JZcf5SqtGhajrusvfRWSeL3Fm4sduQC1gbfPgMyQySf2tqS1yU5yTiHEutdUZkswHXHg6zzyjK6Vg92GA',
      instruction: 'MintToCollectionV1',
      slot: 356098299,
    });
  });
});
