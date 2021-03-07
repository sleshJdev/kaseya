const get = require('./signed-get')

module.exports = {
    fetchProcs: () => (get('/automation/agentprocs')),
    fetchAgents: () => (get('/assetmgmt/agents')),
    fetchPatchStatus: (agentId) => (get(`/assetmgmt/patch/${agentId}/status`)),
    fetchAuditSummaries: () => (get('/assetmgmt/audit')),
    fetchAgentSummary: (agentId) => (get(`/assetmgmt/audit/${agentId}/summary`)),
    fetchSecurityProducts: (agentId) => (get(`/assetmgmt/audit/${agentId}/software/securityproducts`)),
    fetchPatchHistory: (agentId) => (get(`/assetmgmt/patch/${agentId}/history?$filter=PatchState eq 1`)),
    fetchMissingPatches: (agentId, hideDeniedPatches) => (get(`/assetmgmt/patch/${agentId}/machineupdate/${hideDeniedPatches}`)),
    fetchAgentProcedureHistory: (agentId) => (get(`/automation/agentprocs/${agentId}/history`)),
    fetchServicedesks: () => (get(`/automation/servicedesks`)),
    fetchUser: (userId) => (get(`/system/users/${userId}`)),
    fetchMachineGroups: (orgId) => (get(`/system/orgs/${orgId}/machinegroups`)),
    fetchOrganizations: () => (get('/system/orgs'))
};