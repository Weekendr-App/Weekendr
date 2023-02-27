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
  Bounds: any;
  /** Date custom scalar type */
  Date: any;
};

export type CreateVenueInput = {
  address: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  picture: Scalars['String'];
};

export type GetVenuesInRangeInput = {
  bounds: Scalars['Bounds'];
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
  me: User;
  venue: Venue;
  venues: Array<Venue>;
  venuesInRange: Array<Venue>;
};


export type QueryVenueArgs = {
  id: Scalars['Float'];
};


export type QueryVenuesInRangeArgs = {
  fields: GetVenuesInRangeInput;
};

export type UpdateVenueInput = {
  address: Scalars['String'];
  id: Scalars['Float'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  picture: Scalars['String'];
};

/** User */
export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['ID'];
};

/** Venue */
export type Venue = {
  __typename?: 'Venue';
  address: Scalars['String'];
  createdAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
  firebaseUserId: Scalars['String'];
  id: Scalars['ID'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  picture: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type VenuesInRangeQueryVariables = Exact<{
  fields: GetVenuesInRangeInput;
}>;


export type VenuesInRangeQuery = { __typename?: 'Query', venuesInRange: Array<{ __typename?: 'Venue', id: string, name: string, picture: string, address: string, latitude: number, longitude: number }> };

export type VenuePageQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type VenuePageQuery = { __typename?: 'Query', venue: { __typename?: 'Venue', id: string, name: string, firebaseUserId: string, picture: string, address: string } };


export const VenuesInRangeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"venuesInRange"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetVenuesInRangeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"venuesInRange"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}}]} as unknown as DocumentNode<VenuesInRangeQuery, VenuesInRangeQueryVariables>;
export const VenuePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VenuePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"venue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"firebaseUserId"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]} as unknown as DocumentNode<VenuePageQuery, VenuePageQueryVariables>;