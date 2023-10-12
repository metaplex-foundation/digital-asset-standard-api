import { RpcInterface, UmiPlugin } from '@metaplex-foundation/umi';
import { DasApiInterface, createDasApiDecorator } from './decorator';

export const dasApi = (): UmiPlugin => ({
  install(umi) {
    umi.rpc = createDasApiDecorator(umi.rpc);
  },
});

declare module '@metaplex-foundation/umi' {
  interface Umi {
    rpc: RpcInterface & DasApiInterface;
  }
}
