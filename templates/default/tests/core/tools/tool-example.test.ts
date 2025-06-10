import { describe, expect, test } from 'bun:test';
import {
	executeGoodbye,
	executeHelloWorld,
} from '@/src/core/tools/tool-example';

describe('executeHelloWorld', () => {
	test('should return a hello world greeting', async () => {
		const name = 'TestUser';
		const result = await executeHelloWorld({ name });
		expect(result).toBe('Hello, TestUser!');
	});
});

describe('executeGoodbye', () => {
	test('should return a goodbye greeting', async () => {
		const name = 'TestUser';
		const result = await executeGoodbye({ name });
		expect(result).toBe('Goodbye, TestUser!');
	});
});
