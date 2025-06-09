import type { Tool, ToolParameters } from 'fastmcp';

import { z } from 'zod';

const hellWorldParametersSchema = z.object({
	name: z.string().describe('Name to greet'),
});

export async function executeHelloWorld(params: { name: string }) {
	return `Hello, ${params.name}!`;
}

export const helloWorldTool = {
	name: 'hello_world',
	description: 'A simple hello world tool',
	parameters: hellWorldParametersSchema,
	execute: executeHelloWorld,
} satisfies Tool<undefined, typeof hellWorldParametersSchema>;

const goodbyeParametersSchema = z.object({
	name: z.string().describe('Name to bid farewell to'),
});

export async function executeGoodbye(params: { name: string }) {
	return `Goodbye, ${params.name}!`;
}

export const goodbyeTool = {
	name: 'goodbye',
	description: 'A simple goodbye tool',
	parameters: goodbyeParametersSchema,
	execute: executeGoodbye,
} satisfies Tool<undefined, typeof goodbyeParametersSchema>;
