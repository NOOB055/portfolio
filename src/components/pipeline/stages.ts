export interface PipelineStage {
	id: string;
	title: string;
	body: string;
}

/*
 * Placeholder copy — rewrite in Joel's voice during the content phase.
 */
export const stages: PipelineStage[] = [
	{
		id: 'build',
		title: 'Build',
		body: 'Hermetic builds, pinned dependencies, containers addressed by digest — artifacts that can be reproduced, not just rebuilt.',
	},
	{
		id: 'test',
		title: 'Test',
		body: 'Fast unit gates and integration suites against ephemeral environments — failures surface in minutes, not after merge.',
	},
	{
		id: 'secure',
		title: 'Secure',
		body: 'SAST, dependency and image scanning, SBOMs, policy-as-code admission — security as a pipeline stage, not a quarterly audit.',
	},
	{
		id: 'deploy',
		title: 'Deploy',
		body: 'Pull-based GitOps: the cluster converges on what Git declares. Rollback is a revert, not a war room.',
	},
	{
		id: 'observe',
		title: 'Observe',
		body: 'Golden signals, SLOs, and alerts that page on symptoms — the feedback loop that keeps deploys boring.',
	},
];
