export const graphqlHttpUrl = import.meta.env.VITE_API_URL.replace(
  /\/api\/v1\/?$/,
  '/graphql',
);
