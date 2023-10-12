import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';
import { DasApiAsset } from '../src';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch a compressed asset by group (${endpoint.name})`, async (t) => {
    // Given a group (key, value) pair.
    const umi = createUmi(endpoint.url);
    const groupKey = 'collection';
    const groupValue = publicKey(
      'J2ZfLdQsaZ3GCmbucJef3cPnPwGcgjDW1SSYtMdq3L9p'
    );

    // When we fetch the asset using the group information.
    const assets = await umi.rpc.getAssetsByGroup({ groupKey, groupValue });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the collection should match.
    assets.items.forEach((asset) => {
      t.like(assets.items[0], <DasApiAsset>{
        grouping: [
          {
            group_key: groupKey,
            group_value: groupValue.toString(),
          },
        ],
      });
    });
  });
});
