export interface PipelineStage {
	id: string;
	title: string;
	body: string;
}

export const stages: PipelineStage[] = [
	{
		id: 'build',
		title: 'Build',
		body: 'Jenkins builds every service into a digest-pinned container — one artifact, promoted through every environment, never rebuilt on the way to production.',
	},
	{
		id: 'test',
		title: 'Test',
		body: 'Unit and integration gates run on every merge request. A red pipeline blocks the road to production — no exceptions, no manual overrides.',
	},
	{
		id: 'secure',
		title: 'Secure',
		body: 'Static analysis, dependency and image scanning, and compliance-as-code — PCI DSS and SOC 2 evidence flows out of the pipeline itself, not a quarterly scramble.',
	},
	{
		id: 'deploy',
		title: 'Deploy',
		body: 'ArgoCD pulls what Git declares; Terraform shapes identical environments across US, EU, and Singapore. Rollback is a revert, not a war room.',
	},
	{
		id: 'observe',
		title: 'Observe',
		body: 'Monitoring and auto-recovery hold 99.9% uptime targets. Alerts page on symptoms, and every incident feeds back into the pipeline.',
	},
];
