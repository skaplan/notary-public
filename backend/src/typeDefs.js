const gql = require('graphql-tag')

const typeDefs = gql`
  type Query {
    viewer: User
    file(hash: String, aliasId: ID): File
  }

  enum Status {
    active
    inactive
    error
  }

  enum FileType {
    file
    note
  }

  type User {
    id: ID!
    email: String!
    hasPassword: Boolean!

    dropboxId: String
    status: Status
    jobs(filter: JobsFilterInput!): JobConnection!

    starredFiles(filter: StarredFilesFilterInput!): StarredFilesConnection!
    search(filter: SearchFilterInput!): SearchResultConnection!
  }

  input JobsFilterInput {
    first: Int
    after: Int
  }

  input SearchFilterInput {
    query: String!
    first: Int
    after: Int
  }

  type SearchResultConnection {
    numCount: Int!
    nodes: [SearchResult!]!
  }

  type SearchResult {
    id: String!
    hash: String!
    fileType: FileType!
    title: String!
    addedAt: String!
  }

  type JobConnection {
    numCount: Int!
    nodes: [Job!]!
  }

  type Job {
    id: ID!
    inProgress: Boolean!

    numFiles: Int!

    startAt: String!
    endAt: String
  }

  input StarredFilesFilterInput {
    query: String
    first: Int
    after: Int
  }

  type StarredFilesConnection {
    numCount: Int!
    nodes: [StarredFile!]!
  }

  type StarredFile {
    id: ID!
    hash: String!
    title: String!
    fileType: FileType!
    body: String

    fileAddedAt: String!

    file: File!
  }

  type Alias {
    id: String!
    file: File!
  }

  type File {
    id: String!

    hash: String!
    title: String!
    fileType: FileType!
    body: String

    blockNumber: Int
    transactionId: String
    proof: Proof

    addedAt: String!

    viewerIsOwner: Boolean!
    viewerSubscribed: Boolean!
    viewerStarred: Boolean!
  }

  type Proof {
    nodes: [ProofNode!]!
  }

  type ProofNode {
    hash: String!
    left: String
    right: String
  }

  type Mutation {
    loginUser(email: String!, password: String!): LoginUserReturn!
    loginUserOauth(oauthCode: String!): LoginUserReturn!
    createUser(input: CreateUserInput!): CreateUserReturn!

    updatePassword(
      oldPassword: String
      newPassword: String!
    ): UpdatePasswordReturn!
    updateEmail(newEmail: String!): UpdateEmailReturn!
    addDropboxAccount(oauthCode: String!): AddDropboxAccountReturn!
  }

  type UpdateEmailReturn {
    user: User
    error: String
  }

  type LoginUserReturn {
    token: String
    user: User
    error: String
  }

  input CreateUserInput {
    email: String!
    password: String!
    fileHash: String
  }

  type CreateUserReturn {
    user: User
    token: String
    error: String
  }

  type UpdatePasswordReturn {
    user: User
    error: String
  }

  type AddDropboxAccountReturn {
    user: User
    error: String
  }

  extend type Mutation {
    createNote(input: CreateNoteInput!): CreateNoteReturn!
    createFile(input: CreateFileInput!): CreateFileReturn!

    updateFileTitle(input: UpdateFileTitleInput!): UpdateFileTitleReturn!
  }

  input CreateNoteInput {
    title: String
    body: String!
  }

  type CreateNoteReturn {
    note: File
    error: String
  }

  input CreateFileInput {
    title: String!
    hash: String!
  }

  type CreateFileReturn {
    file: File
    error: String
  }

  input UpdateFileTitleInput {
    hash: String!
    title: String!
  }

  type UpdateFileTitleReturn {
    file: File
    error: String
  }

  extend type Mutation {
    createStarredFile(hash: String!): StarredFile!
    deleteStarredFile(hash: String!): File!

    createAlias(hash: String!): Alias!
    createNotification(input: CreateNotificationInput!): File!
  }

  input CreateNotificationInput {
    hash: String!
    email: String
  }

  extend type Mutation {
    pauseSyncing: User!
    startSyncing: User!

    sendPasswordReset(email: String!): Boolean!
    resetUserPassword(
      code: String!
      password: String!
    ): ResetUserPasswordReturn!

    disassociateDropboxAccount: User!
  }

  type ResetUserPasswordReturn {
    error: String
    user: User
    token: String
  }
`

module.exports = typeDefs
