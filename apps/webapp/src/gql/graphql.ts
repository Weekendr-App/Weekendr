/* eslint-disable */
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
  picture?: InputMaybe<Scalars['String']>;
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
};


export type QueryVenueArgs = {
  id: Scalars['Float'];
};

export type UpdateVenueInput = {
  id: Scalars['Float'];
  name: Scalars['String'];
  picture?: InputMaybe<Scalars['String']>;
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
  createdAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Date'];
};
