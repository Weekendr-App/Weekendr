/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query NavbarMe {\n    me {\n      id\n      role\n    }\n  }\n": types.NavbarMeDocument,
    "\n  query venuesInRange($fields: GetVenuesInRangeInput!) {\n    venuesInRange(fields: $fields) {\n      id\n      name\n      picture\n      isOwnedByMe\n      address\n      latitude\n      longitude\n      status\n    }\n  }\n": types.VenuesInRangeDocument,
    "\n  query ProfileMe {\n    me {\n      id\n      role\n      venues {\n        id\n        name\n        picture\n        address\n        status\n      }\n    }\n  }\n": types.ProfileMeDocument,
    "\n  query DraftVenues {\n    draftVenues {\n      id\n      name\n      picture\n      address\n      status\n      latitude\n      longitude\n      phone\n    }\n  }\n": types.DraftVenuesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NavbarMe {\n    me {\n      id\n      role\n    }\n  }\n"): (typeof documents)["\n  query NavbarMe {\n    me {\n      id\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query venuesInRange($fields: GetVenuesInRangeInput!) {\n    venuesInRange(fields: $fields) {\n      id\n      name\n      picture\n      isOwnedByMe\n      address\n      latitude\n      longitude\n      status\n    }\n  }\n"): (typeof documents)["\n  query venuesInRange($fields: GetVenuesInRangeInput!) {\n    venuesInRange(fields: $fields) {\n      id\n      name\n      picture\n      isOwnedByMe\n      address\n      latitude\n      longitude\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProfileMe {\n    me {\n      id\n      role\n      venues {\n        id\n        name\n        picture\n        address\n        status\n      }\n    }\n  }\n"): (typeof documents)["\n  query ProfileMe {\n    me {\n      id\n      role\n      venues {\n        id\n        name\n        picture\n        address\n        status\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DraftVenues {\n    draftVenues {\n      id\n      name\n      picture\n      address\n      status\n      latitude\n      longitude\n      phone\n    }\n  }\n"): (typeof documents)["\n  query DraftVenues {\n    draftVenues {\n      id\n      name\n      picture\n      address\n      status\n      latitude\n      longitude\n      phone\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;