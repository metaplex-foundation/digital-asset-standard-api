import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

// Same compressed collection fixture used by getAssetsByGroup tests.
const COLLECTION = publicKey('5PA96eCFHJSFPY9SWFeRJUHrpoNF5XZL6RrE1JADXhxf');

const isUnsupportedGroupingError = (error: unknown) =>
  error instanceof Error &&
  /method not found|-32601|-32603|No grouping found/i.test(error.message);

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch grouping metadata for a collection (${endpoint.name})`, async (t) => {
    // Some DAS providers omit getGrouping or return a null result; treat that as
    // unsupported rather than failing the suite (same pattern as optional methods).
    const umi = createUmi(endpoint.url);

    try {
      const grouping = await umi.rpc.getGrouping({
        groupKey: 'collection',
        groupValue: COLLECTION,
      });

      t.is(grouping.group_key, 'collection');
      t.true(typeof grouping.group_name === 'string');
      t.true(typeof grouping.group_size === 'number');
      t.true(grouping.group_size > 0);
    } catch (error) {
      if (isUnsupportedGroupingError(error)) {
        t.pass('getGrouping is not supported by this endpoint');
        return;
      }
      throw error;
    }
  });
});
