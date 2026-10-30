import { createSignal } from 'solid-js';

import { useToasts } from '@/entities/toasts';
import { i18n } from '@/shared/i18n';
import { closeModal, MODALS, showModal } from '@/shared/lib/modal';

import { apiTokenCreateMutation } from '../../../api/apiTokenCreateMutation';
import { apiTokenRevokeMutation } from '../../../api/apiTokenRevokeMutation';
import { apiTokensQuery } from '../../../api/apiTokensQuery';
import { MCP_URL } from '../config/mcpConfig';
import { buildConnectCommand } from '../lib/buildConnectCommand';
import { toApiTokenView } from '../lib/toApiTokenView';

export const useMcp = () => {
  const toasts = useToasts();
  const [tokenName, setTokenName] = createSignal('');
  const [created, setCreated] = createSignal<{
    id: string;
    secret: string;
  } | null>(null);
  const [isCreating, setIsCreating] = createSignal(false);
  const [pendingRevokeId, setPendingRevokeId] = createSignal<string | null>(
    null,
  );

  const [apiTokensResult, refetchApiTokens] = apiTokensQuery();
  const [, createApiToken] = apiTokenCreateMutation();
  const [revokeResult, revokeApiToken] = apiTokenRevokeMutation();

  const mcpUrl = () => MCP_URL;

  const tokens = () =>
    (apiTokensResult.data?.apiTokens ?? []).map(toApiTokenView);

  const connectCommand = () => {
    const createdToken = created();
    return createdToken ? buildConnectCommand(createdToken.secret) : null;
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

    const { apiToken, secret } = result.data.apiTokenCreate;
    setCreated({ id: apiToken.id, secret });
    setTokenName('');
    refetch();
  };

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    void create();
  };

  const isRevoking = () => revokeResult.fetching;

  const requestRevoke = (id: string) => {
    setPendingRevokeId(id);
    showModal(MODALS.REVOKE_API_TOKEN);
  };

  const cancelRevoke = () => setPendingRevokeId(null);

  const confirmRevoke = async () => {
    const id = pendingRevokeId();
    if (!id) return;

    const result = await revokeApiToken({ id });

    if (result.error) {
      toasts.show('error', i18n.t('settings.mcp.revoke_error'));
      return;
    }

    closeModal(MODALS.REVOKE_API_TOKEN);
    setPendingRevokeId(null);
    if (created()?.id === id) setCreated(null);
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
    isRevoking,
    requestRevoke,
    cancelRevoke,
    confirmRevoke,
    copy,
  };
};
