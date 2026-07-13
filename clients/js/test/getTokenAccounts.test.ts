import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

// Mainnet fixtures used in Helius DAS API docs.
const OWNER_WITH_TOKEN_ACCOUNTS = publicKey(
  'N4f6zftYsuu4yT7icsjLwh4i6pB1zvvKbseHj2NmSQw'
);
const USDC_MINT = publicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch token accounts by owner (${endpoint.name})`, async (t) => {
    const umi = createUmi(endpoint.url);

    const tokenAccounts = await umi.rpc.getTokenAccounts({
      ownerAddress: OWNER_WITH_TOKEN_ACCOUNTS,
      limit: 10,
    });

    t.true(typeof tokenAccounts.total === 'number');
    t.true(tokenAccounts.total > 0);
    t.true(typeof tokenAccounts.limit === 'number');
    t.true(Array.isArray(tokenAccounts.token_accounts));
    t.true(tokenAccounts.token_accounts.length > 0);
    t.true(Array.isArray(tokenAccounts.errors));

    const tokenAccount = tokenAccounts.token_accounts[0];
    t.true(typeof tokenAccount.address === 'string');
    t.true(typeof tokenAccount.amount === 'number');
    t.true(typeof tokenAccount.mint === 'string');
    t.true(typeof tokenAccount.owner === 'string');
    t.true(typeof tokenAccount.frozen === 'boolean');
    t.true(typeof tokenAccount.delegated_amount === 'number');
    t.true(tokenAccount.address.length > 0);
    t.true(tokenAccount.mint.length > 0);
    t.true(tokenAccount.owner.length > 0);
    t.true(tokenAccount.owner === OWNER_WITH_TOKEN_ACCOUNTS);
  });

  test(`it can fetch token accounts by mint (${endpoint.name})`, async (t) => {
    const umi = createUmi(endpoint.url);

    const tokenAccounts = await umi.rpc.getTokenAccounts({
      mintAddress: USDC_MINT,
      limit: 5,
    });

    t.true(typeof tokenAccounts.total === 'number');
    t.true(tokenAccounts.total > 0);
    t.true(tokenAccounts.limit === 5);
    t.true(Array.isArray(tokenAccounts.token_accounts));
    t.true(tokenAccounts.token_accounts.length > 0);
    t.true(tokenAccounts.token_accounts.length <= 5);

    const tokenAccount = tokenAccounts.token_accounts[0];
    t.is(tokenAccount.mint, USDC_MINT);
  });

  test(`it can fetch token accounts with display options (${endpoint.name})`, async (t) => {
    const umi = createUmi(endpoint.url);

    const tokenAccounts = await umi.rpc.getTokenAccounts({
      ownerAddress: OWNER_WITH_TOKEN_ACCOUNTS,
      limit: 10,
      options: {
        showZeroBalance: true,
        showFungible: true,
      },
    });

    t.true(typeof tokenAccounts.total === 'number');
    t.true(tokenAccounts.total > 0);
    t.true(Array.isArray(tokenAccounts.token_accounts));
    t.true(tokenAccounts.token_accounts.length > 0);
    t.true(Array.isArray(tokenAccounts.errors));
  });

  test(`it can fetch token accounts with pagination (${endpoint.name})`, async (t) => {
    const umi = createUmi(endpoint.url);

    const tokenAccounts = await umi.rpc.getTokenAccounts({
      ownerAddress: OWNER_WITH_TOKEN_ACCOUNTS,
      limit: 3,
      page: 1,
    });

    t.true(typeof tokenAccounts.total === 'number');
    t.true(tokenAccounts.total > 0);
    t.true(tokenAccounts.limit === 3);
    t.true(Array.isArray(tokenAccounts.token_accounts));
    t.true(tokenAccounts.token_accounts.length > 0);
    t.true(tokenAccounts.token_accounts.length <= 3);
  });

  test(`it returns an empty list for an owner with no token accounts (${endpoint.name})`, async (t) => {
    const umi = createUmi(endpoint.url);
    const emptyOwnerAddress = publicKey(
      '8Q7wEhtC18NYaaJRSexF6o2LH6cUQrDJSG9Jpgy5hw8P'
    );

    const tokenAccounts = await umi.rpc.getTokenAccounts({
      ownerAddress: emptyOwnerAddress,
      limit: 10,
    });

    t.true(Array.isArray(tokenAccounts.token_accounts));
    t.true(tokenAccounts.token_accounts.length === 0);
    t.is(tokenAccounts.total, 0);
    t.true(Array.isArray(tokenAccounts.errors));
  });

  test(`it accepts displayOptions as an alias for options (${endpoint.name})`, async (t) => {
    const umi = createUmi(endpoint.url);

    const tokenAccounts = await umi.rpc.getTokenAccounts({
      ownerAddress: OWNER_WITH_TOKEN_ACCOUNTS,
      limit: 10,
      displayOptions: {
        showZeroBalance: true,
      },
    });

    t.true(typeof tokenAccounts.total === 'number');
    t.true(tokenAccounts.total > 0);
    t.true(Array.isArray(tokenAccounts.token_accounts));
    t.true(tokenAccounts.token_accounts.length > 0);
  });
});
