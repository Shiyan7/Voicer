import tseslint from 'typescript-eslint';
import baseConfig from './eslint.base.js';
import eslintPluginSolid from 'eslint-plugin-solid';
import eslintPluginReact from 'eslint-plugin-react';

export default tseslint.config(baseConfig, {
  plugins: {
    solid: eslintPluginSolid,
    react: eslintPluginReact,
  },
  rules: {
    'no-empty-pattern': 'error',
    'solid/prefer-for': 'error',
    'solid/prefer-classlist': 'error',
    'solid/no-react-specific-props': 'error',
    'react/jsx-curly-brace-presence': [
      'error',
      {
        props: 'never',
        children: 'never',
      },
    ],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'function-expression',
      },
    ],
  },
});
