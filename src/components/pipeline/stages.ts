export interface PipelineStage {
	id: string;
	title: string;
	body: string;
	tools: string[];
}

export const stages: PipelineStage[] = [
	{
		id: 'build',
		title: 'Build',
		body: 'One build per change, pinned by digest and promoted unchanged from dev to prod. If staging and production ran different bytes, you never tested what you shipped.',
		tools: ['jenkins', 'docker', 'ansible'],
	},
	{
		id: 'test',
		title: 'Test',
		body: 'Unit and integration gates on every merge request, against throwaway environments that mirror prod. Green is the only way through — the manual override always gets used on the worst possible day.',
		tools: ['jenkins', 'sonarqube'],
	},
	{
		id: 'secure',
		title: 'Secure',
		body: 'Image and dependency scanning, runtime container defence, secrets out of code, and findings funnelled to one queue. Under PCI DSS and SOC 2 the audit trail falls out of the pipeline — controls as code, not screenshots gathered the week before an assessment.',
		tools: ['trivy', 'twistlock', 'vault', 'defectdojo'],
	},
	{
		id: 'deploy',
		title: 'Deploy',
		body: 'Pull-based GitOps: the cluster converges on what Git declares, identically across regions, scaling itself to load. Nobody pushes to prod, so rollback is a revert — not a 2 a.m. war room.',
		tools: ['argocd', 'terraform', 'k8s', 'karpenter'],
	},
	{
		id: 'observe',
		title: 'Observe',
		body: 'SLOs and alerts that page on user-visible symptoms, not dashboards nobody reads. Every incident closes the loop as a new test or guardrail, so the same failure cannot return.',
		tools: ['prometheus', 'grafana', 'wazuh'],
	},
];
