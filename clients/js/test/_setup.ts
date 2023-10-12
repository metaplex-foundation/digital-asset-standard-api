import { createUmi as baseCreateUmi } from '@metaplex-foundation/umi';
import { testPlugins } from '@metaplex-foundation/umi-bundle-tests';
import { dasApi } from '../src/plugin';

export const DAS_API_ENDPOINTS: { name: string; url: string }[] = [];

Object.keys(process.env).forEach(function (key) {
  if (key.startsWith('DAS_API_')) {
    const name = key.substring('DAS_API_'.length);
    const url = process.env[key]!;
    DAS_API_ENDPOINTS.push({ name, url });
  }
});

export const createUmi = (endpoint: string) =>
  baseCreateUmi().use(testPlugins(endpoint)).use(dasApi());
