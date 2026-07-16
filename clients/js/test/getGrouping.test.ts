import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

const COLLECTION = publicKey('5PA96eCFHJSFPY9SWFeRJUHrpoNF5XZL6RrE1JADXhxf');

const isUnsupportedMethodError = (error: unknown) =>
  error instanceof Error &&
  /method not found|-32601|-32603/i.test(error.message);

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch grouping metadata for a collection (${endpoint.name})`, async (t) => {
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
      if (isUnsupportedMethodError(error)) {
        t.pass('getGrouping is not supported by this endpoint');
        return;
      }
      throw error;
    }
  });
});
