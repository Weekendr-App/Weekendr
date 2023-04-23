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

/** Category */
export type Category = {
  __typename?: 'Category';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CreateEventInput = {
  categoryId: Scalars['Float'];
  description?: InputMaybe<Scalars['String']>;
  endDate: Scalars['Date'];
  name: Scalars['String'];
  picture?: InputMaybe<Scalars['String']>;
  price: Scalars['Float'];
  startDate: Scalars['Date'];
  venueId: Scalars['Float'];
};

export type CreateVenueInput = {
  address: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  phone: Scalars['String'];
  picture: Scalars['String'];
};

/** Event */
export type Event = {
  __typename?: 'Event';
  category: Category;
  createdAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
  description?: Maybe<Scalars['String']>;
  endDate: Scalars['Date'];
  id: Scalars['ID'];
  name: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
  price: Scalars['Float'];
  startDate: Scalars['Date'];
  status: EventStatus;
  updatedAt: Scalars['Date'];
  venue: Venue;
};

export enum EventStatus {
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export type GetVenuesInRangeInput = {
  bounds: Scalars['Bounds'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelEvent: Event;
  createEvent: Event;
  createVenue: Venue;
  deleteVenue: Venue;
  publishVenue: Venue;
  updateVenue: Venue;
};


export type MutationCancelEventArgs = {
  eventId: Scalars['Float'];
};


export type MutationCreateEventArgs = {
  fields: CreateEventInput;
};


export type MutationCreateVenueArgs = {
  fields: CreateVenueInput;
};


export type MutationDeleteVenueArgs = {
  id: Scalars['Float'];
};


export type MutationPublishVenueArgs = {
  id: Scalars['Float'];
};


export type MutationUpdateVenueArgs = {
  fields: UpdateVenueInput;
};

export type Query = {
  __typename?: 'Query';
  draftVenues: Array<Venue>;
  event: Event;
  me: User;
  venue: Venue;
  venueEvents: Array<Event>;
  venuesInRange: Array<Venue>;
};


export type QueryEventArgs = {
  eventId: Scalars['Float'];
};


export type QueryVenueArgs = {
  id: Scalars['Float'];
};


export type QueryVenueEventsArgs = {
  venueId: Scalars['Float'];
};


export type QueryVenuesInRangeArgs = {
  fields: GetVenuesInRangeInput;
};

/** User role */
export enum Role {
  Moderator = 'MODERATOR',
  Owner = 'OWNER'
}

export type UpdateVenueInput = {
  address: Scalars['String'];
  id: Scalars['Float'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  phone: Scalars['String'];
  picture: Scalars['String'];
};

/** User */
export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['ID'];
  role: Role;
  venues: Array<Venue>;
};

/** Venue */
export type Venue = {
  __typename?: 'Venue';
  address: Scalars['String'];
  createdAt: Scalars['Date'];
  deletedAt?: Maybe<Scalars['Date']>;
  events?: Maybe<Array<Event>>;
  id: Scalars['ID'];
  isOwnedByMe?: Maybe<Scalars['Boolean']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  phone: Scalars['String'];
  picture: Scalars['String'];
  status: VenueStatus;
  updatedAt: Scalars['Date'];
};

export enum VenueStatus {
  Active = 'ACTIVE',
  Draft = 'DRAFT'
}

export type NavbarMeQueryVariables = Exact<{ [key: string]: never; }>;


export type NavbarMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, role: Role } };

export type VenuesInRangeQueryVariables = Exact<{
  fields: GetVenuesInRangeInput;
}>;


export type VenuesInRangeQuery = { __typename?: 'Query', venuesInRange: Array<{ __typename?: 'Venue', id: string, name: string, picture: string, isOwnedByMe?: boolean | null, address: string, latitude: number, longitude: number, status: VenueStatus }> };

export type ProfileMeQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, role: Role, venues: Array<{ __typename?: 'Venue', id: string, name: string, picture: string, address: string, status: VenueStatus }> } };

export type DraftVenuesQueryVariables = Exact<{ [key: string]: never; }>;


export type DraftVenuesQuery = { __typename?: 'Query', draftVenues: Array<{ __typename?: 'Venue', id: string, name: string, picture: string, address: string, status: VenueStatus, latitude: number, longitude: number, phone: string }> };


export const NavbarMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NavbarMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<NavbarMeQuery, NavbarMeQueryVariables>;
export const VenuesInRangeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"venuesInRange"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetVenuesInRangeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"venuesInRange"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"isOwnedByMe"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<VenuesInRangeQuery, VenuesInRangeQueryVariables>;
export const ProfileMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"venues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<ProfileMeQuery, ProfileMeQueryVariables>;
export const DraftVenuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DraftVenues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"draftVenues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"picture"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]} as unknown as DocumentNode<DraftVenuesQuery, DraftVenuesQueryVariables>;