import get from './signed-get'

export const fetchProcs = () => (get('/automation/agentprocs'));
export const fetchAgents = () => (get('/assetmgmt/agents'));
export const fetchPatchStatus = (agentId) => (get(`/assetmgmt/patch/${agentId}/status`));
export const fetchAuditSummaries = () => (get('/assetmgmt/audit'));
export const fetchAgentSummary = (agentId) => (get(`/assetmgmt/audit/${agentId}/summary`));
export const fetchSecurityProducts = (agentId) => (get(`/assetmgmt/audit/${agentId}/software/securityproducts`));
export const fetchPatchHistory = (agentId) => (get(`/assetmgmt/patch/${agentId}/history?$filter=PatchState eq 1`));
export const fetchMissingPatches = (agentId, hideDeniedPatches) => (get(`/assetmgmt/patch/${agentId}/machineupdate/${hideDeniedPatches}`));
export const fetchAgentProcedureHistory = (agentId) => (get(`/automation/agentprocs/${agentId}/history`));
export const fetchServicedesks = () => (get(`/automation/servicedesks`));
export const fetchUser = (userId) => (get(`/system/users/${userId}`));
export const fetchMachineGroups = (orgId) => (get(`/system/orgs/${orgId}/machinegroups`));
export const fetchOrganizations = () => (get('/system/orgs'));