/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date custom scalar type */
  Date: any;
};

export type CreateVenueInput = {
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createVenue: Venue;
  deleteVenue: Venue;
  updateVenue: Venue;
};


export type MutationCreateVenueArgs = {
  fields: CreateVenueInput;
};


export type MutationDeleteVenueArgs = {
  id: Scalars['Float'];
};


export type MutationUpdateVenueArgs = {
  fields: UpdateVenueInput;
};

export type Query = {
  __typename?: 'Query';
  venue: Venue;
  venues: Array<Venue>;
};


export type QueryVenueArgs = {
  id: Scalars['Float'];
};

export type UpdateVenueInput = {
  id: Scalars['Float'];
  name: Scalars['String'];
};

/** Venue */
export type Venue = {
  __typename?: 'Venue';
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type AllVenuesQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type AllVenuesQueryQuery = { __typename?: 'Query', venues: Array<{ __typename?: 'Venue', id: string, name: string, createdAt: any, updatedAt: any }> };


export const AllVenuesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allVenuesQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"venues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AllVenuesQueryQuery, AllVenuesQueryQueryVariables>;