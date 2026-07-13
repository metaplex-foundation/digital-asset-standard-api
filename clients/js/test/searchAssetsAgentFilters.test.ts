import test from 'ava';
import { publicKey, RpcInterface } from '@metaplex-foundation/umi';
import { createDasApiDecorator } from '../src/decorator';

test('searchAssets passes agent filters to the RPC call', async (t) => {
  const agentToken = publicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
  const assetSigner = publicKey('6ttUwc5VVmHeVKTddB6XM5vQgBMfw62DThuoiVEufVZq');

  let capturedMethod: string | undefined;
  let capturedParams: Record<string, unknown> | undefined;

  const mockRpc = {
    call: async (method: string, params: Record<string, unknown>) => {
      capturedMethod = method;
      capturedParams = params;
      return { total: 0, limit: 1, items: [] };
    },
  } as unknown as RpcInterface;

  const rpc = createDasApiDecorator(mockRpc);

  await rpc.searchAssets({
    isAgent: true,
    agentToken,
    assetSigner,
    interface: 'MplCoreAsset',
    limit: 10,
  });

  t.is(capturedMethod, 'searchAssets');
  t.is(capturedParams?.isAgent, true);
  t.is(capturedParams?.agentToken, agentToken);
  t.is(capturedParams?.assetSigner, assetSigner);
  t.is(capturedParams?.interface, 'MplCoreAsset');
  t.is(capturedParams?.limit, 10);
});
