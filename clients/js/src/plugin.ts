import { RpcInterface, UmiPlugin } from '@metaplex-foundation/umi';
import {
  DasApiDecoratorOptions,
  DasApiInterface,
  createDasApiDecorator,
} from './decorator';

export type DasApiOptions = DasApiDecoratorOptions;

export const dasApi = (options: DasApiOptions = {}): UmiPlugin => ({
  install(umi) {
    umi.rpc = createDasApiDecorator(umi.rpc, options);
  },
});

declare module '@metaplex-foundation/umi/dist/types/Umi' {
  interface Umi {
    rpc: RpcInterface & DasApiInterface;
  }
}
