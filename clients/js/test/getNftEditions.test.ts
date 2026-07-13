import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

// Mainnet master edition mint used in Helius DAS API docs.
const MASTER_EDITION_MINT = publicKey(
  'Ey2Qb8kLctbchQsMnhZs5DjY32To2QtPuXNwWvk4NosL'
);

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch NFT editions by master edition mint (${endpoint.name})`, async (t) => {
    const umi = createUmi(endpoint.url);

    const editions = await umi.rpc.getNftEditions({
      mintAddress: MASTER_EDITION_MINT,
      limit: 10,
    });

    t.true(typeof editions.total === 'number');
    t.true(typeof editions.limit === 'number');
    t.true(typeof editions.supply === 'number');
    t.true(editions.supply > 0);
    t.true(typeof editions.master_edition_address === 'string');
    t.true(editions.master_edition_address.length > 0);
    t.true(Array.isArray(editions.editions));
    t.true(editions.editions.length > 0);

    const edition = editions.editions[0];
    t.true(typeof edition.edition_address === 'string');
    t.true(typeof edition.edition_number === 'number');
    t.true(typeof edition.mint_address === 'string');
    t.true(edition.edition_address.length > 0);
    t.true(edition.edition_number > 0);
    t.true(edition.mint_address.length > 0);
  });

  test(`it can fetch NFT editions with pagination (${endpoint.name})`, async (t) => {
    const umi = createUmi(endpoint.url);

    const editions = await umi.rpc.getNftEditions({
      mintAddress: MASTER_EDITION_MINT,
      limit: 5,
      page: 1,
    });

    t.true(typeof editions.total === 'number');
    t.true(editions.limit === 5);
    t.true(Array.isArray(editions.editions));
    t.true(editions.editions.length > 0);
    t.true(editions.editions.length <= 5);
  });

  test(`it throws when the mint has no master edition (${endpoint.name})`, async (t) => {
    const umi = createUmi(endpoint.url);
    const nonMasterEditionMint = publicKey('11111111111111111111111111111111');

    await t.throwsAsync(
      () =>
        umi.rpc.getNftEditions({
          mintAddress: nonMasterEditionMint,
          limit: 10,
        }),
      { message: /master edition|not found|No editions found/i }
    );
  });
});
