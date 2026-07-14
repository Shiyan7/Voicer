import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../server/src/schema.gql',
  ignoreNoDocuments: true,
  generates: {
    './Dictionary/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        includeDirectives: true,
        commentDescriptions: true,
      },
    },
  },
};

export default config;
