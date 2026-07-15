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
    './Dictionary/schema.generated.gql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
        commentDescriptions: true,
      },
    },
  },
};

export default config;
