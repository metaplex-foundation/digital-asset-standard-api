import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch compressed assets by creator (${endpoint.name})`, async (t) => {
    // Given an creator address.
    const umi = createUmi(endpoint.url);
    const creator = publicKey('D3XrkNZz6wx6cofot7Zohsf2KSsu2ArngNk8VqU9cTY3');

    // When we fetch the asset using the creator.
    const assets = await umi.rpc.getAssetsByCreator({
      creator,
      onlyVerified: false,
      limit: 10,
    });

    // Then we expect to find assets.
    t.true(assets.items.length > 0);

    // And the creator should be present.
    assets.items.forEach((asset) => {
      t.true(asset.creators.some((other) => other.address === creator));
    });
  });
});
