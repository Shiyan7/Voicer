import { createSignal } from 'solid-js';

import { useToasts } from '@/entities/toasts';
import { i18n } from '@/shared/i18n';

import { apiTokenCreateMutation } from '../../../api/apiTokenCreateMutation';
import { apiTokenRevokeMutation } from '../../../api/apiTokenRevokeMutation';
import { apiTokensQuery } from '../../../api/apiTokensQuery';
import { MCP_URL } from '../config/mcpConfig';
import { buildConnectCommand } from '../lib/buildConnectCommand';
import { toApiTokenView } from '../lib/toApiTokenView';

export const useMcp = () => {
  const toasts = useToasts();
  const [tokenName, setTokenName] = createSignal('');
  const [secret, setSecret] = createSignal<string | null>(null);
  const [isCreating, setIsCreating] = createSignal(false);

  const [apiTokensResult, refetchApiTokens] = apiTokensQuery();
  const [, createApiToken] = apiTokenCreateMutation();
  const [, revokeApiToken] = apiTokenRevokeMutation();

  const mcpUrl = () => MCP_URL;

  const tokens = () =>
    (apiTokensResult.data?.apiTokens ?? []).map(toApiTokenView);

  const connectCommand = () => {
    const createdSecret = secret();
    return createdSecret ? buildConnectCommand(createdSecret) : null;
  };

  const refetch = () => refetchApiTokens({ requestPolicy: 'network-only' });

  const create = async () => {
    setIsCreating(true);
    const result = await createApiToken({ name: tokenName() });
    setIsCreating(false);

    if (result.error || !result.data) {
      toasts.show('error', i18n.t('settings.mcp.create_error'));
      return;
    }

    setSecret(result.data.apiTokenCreate.secret);
    setTokenName('');
    refetch();
  };

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    void create();
  };

  const revoke = async (id: string) => {
    const result = await revokeApiToken({ id });

    if (result.error) {
      toasts.show('error', i18n.t('settings.mcp.revoke_error'));
      return;
    }

    setSecret(null);
    refetch();
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toasts.show('success', i18n.t('settings.mcp.copied'));
  };

  return {
    mcpUrl,
    tokens,
    tokenName,
    setTokenName,
    isCreating,
    connectCommand,
    submit,
    revoke,
    copy,
  };
};
