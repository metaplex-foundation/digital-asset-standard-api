import { publicKey } from '@metaplex-foundation/umi';
import test from 'ava';
import { GetAssetProofsRpcResponse } from '../src';
import { DAS_API_ENDPOINTS, createUmi } from './_setup';

DAS_API_ENDPOINTS.forEach((endpoint) => {
  test(`it can fetch the proof of a compressed asset by ID (${endpoint.name})`, async (t) => {
    // Given a minted NFT on mainnet.
    const umi = createUmi(endpoint.url);
    const assetIds = [
      publicKey('8TrvJBRa6Pzb9BDadqroHhWTHxaxK8Ws8r91oZ2jxaVV'),
      publicKey('5HsEEPqaMKvneyoxMEEfFh47CUrWTZruhrECg4Fsn4Go'),
    ];

    // When we fetch the proof of the asset using its ID.
    const assets = await umi.rpc.getAssetProofs(assetIds);

    // Then we expect the following data.
    t.like(assets[assetIds[0]], <GetAssetProofsRpcResponse>{
      root: 'JDTY14oS9YbFu26CdwHqtEtZSwoTjkvUEwqcvV4U6nrg',
      proof: [
        'Ggi6a8F25E1JwWd5n71SftUv17UEBr7a83Xwh16DcN6B',
        '5v2nipGzYXbWPJERgiZcrx9BiSFU9Q33L4T8hJ1vA58v',
        '8k8dhJywAh4t8uFq8kqBTdwDDgzgPVc9xmeY4rJsMga2',
        'DCuEosqnNBcfqGzjx72eFzFr7M7NFTqwAW4FDxSvogij',
        'Ec5t1jEkjZDchfxkAkdFFVme9HTGAGSKppfSeQ2Ka6Zw',
        'GByW2nB4jj4CcxsU2eoq6noec7xoiJcrhHSZavmVL3im',
        '4oxTpsMHmSB35rDeo7FMS5WLzkCheK2UrcFNuqEAepPu',
        '3RxQhB1eEmPrApKkvxJpNi5MtSu3xq559RkrYDSq6nuy',
        '5sW4aH5ru8A5RuB5grwnidy3pNXW4QgdzoqQaXpzGwYB',
        'ApFoLGfHGxVt8cSw2ehNxK49LnbF5ttKMxtgeargVjwS',
        '3JCY91kmgPEV43P8kmmtDucFzC8tsha9QCSGk7G3p6T9',
        '9ZKCDDyZbKARahWV3Ko9Mytxi9DcNop43S1Rvh99GGns',
        '6hd194SYhNGomW9yz6dh6Yz3XGcygZRuVoKvRKmbPYXY',
        '6zienDVQkxC9WWQrUHvUdGRc9PrHqD62ciuoo6Ut5Qty',
        '4RWZYXC27xVfhNbMZDoLi7AshULE9b2iZfbkE6nhgAi8',
        'GNh19DPL9grMDNQrtDtPNcQJo5nRBMnSeZhewxpctRa5',
        '4ATZnd4mjvnmz69bhg1vTYVPqTA5NBcS5XvtvN6oeA72',
        '2QVNRhigD37XJcEp4ytpkD9rpDMcy26ew3bTWVTax6Yw',
        'CgbvcmyzfWzHKMEX9nRGHJ88U2JbFPxDkDh8mM63DVmb',
        '54s3EkFtSapQuxGhQHBHxsnq9x1dgQMpAbBNeEC9B3Se',
      ],
      node_index: 1588456,
      leaf: 'BtbdpcxueKdAwpwRtyXMpUMV2Zbjd6YYtWvyiAK2FNQ6',
      tree_id: '9PHhh7dJqdWnmjwiZEe6bMCFKnRSL436msEhN587adu5',
    });

    t.like(assets[assetIds[1]], <GetAssetProofsRpcResponse>{
      root: '2Rj3vSNARxgP4QQP4KaPkXn58PTdqzHfkcnKXvocgzKA',
      proof: [
        '52uSqNfHSVUnFuLKVha9AVAW4pmYgUQvUJaQhm1c1fjp',
        '9ZhwH1657fELQfFXXkQfS5Xzvxi1fSFkqhzV8byGAtmx',
        'GVrykGPcQNP3LVp82eR6qvsrU2ndSfFgYHPiDruqqPFY',
        'DK7kSgAwHJQvxHnNYmK3Qm6vsg5UfTMtuAjyet3WFci3',
        'GSz87YKd3YoZWcEKhnjSsYJwv8o5aWGdBdGGYUphRfTh',
        'zLUDhASAn7WA1Aqc724azRpZjKCjMQNATApe74JMg8C',
        'ABnEXHmveD6iuMwfw2po7t6TPjn5kYMVwYJMi3fa9K91',
        'JDh7eiWiUWtiWn623iybHqjQ6AQ6c2Czz8m6ZxwSCkta',
        'BFvmeiEuzAYcMR8YxcuCMGYPDpjcmP5hsNbcswgQ8pMc',
        'EvxphsdRErrDMs9nhFfF4nzq8i1C2KSogA7uB96TPpPR',
        'HpMJWAzQv9HFgHBqY1o8V1B27sCYPFHJdGivDA658jEL',
        'HjnrJn5vBUUzpCxzjjM9ZnCPuXei2cXKJjX468B9yWD7',
        '4YCF1CSyTXm1Yi9W9JeYevawupkomdgy2dLxEBHL9euq',
        'E3oMtCuPEauftdZLX8EZ8YX7BbFzpBCVRYEiLxwPJLY2',
        '7DiCkBhs5HQLPEsKY6EjfNd3oBswnfRk9UAZcHqczL7m',
        'FhsNgK6GGU1cRPFbmPhrEZ95Zj8vorjK6GmhFuwmZsUm',
      ],
      node_index: 65542,
      leaf: 'BMTV2opRYFErKfarctLn98abgoxjFnoXwDzgtGBM5rcq',
      tree_id: 'AQTa9eaoCPn4aqeHbVcRh3wL7ifv5wSHSbrJM4rqRVYa',
    });
  });
});
