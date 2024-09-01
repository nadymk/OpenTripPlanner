import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import request, { RequestDocument } from 'graphql-request';
import { Variables, VariablesAndRequestHeadersArgs } from 'graphql-request/build/esm/types';
import { QueryType } from '../gql/graphql';

const endpoint = import.meta.env.VITE_API_URL;

export const graphQLClient = async <T = QueryType, V extends Variables = Variables>(
  query: RequestDocument | TypedDocumentNode<T, V>,
  variables?: VariablesAndRequestHeadersArgs<V>,
) => request(endpoint, query, { ...variables }) as Promise<T>;
