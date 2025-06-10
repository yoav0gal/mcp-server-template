#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises'; // Using promises version for async/await
import { stdin, stdout } from 'node:process';
import { exec } from 'node:child_process'; // Added for Bun check

// Get the directory where the source files are stored (the template project root)
const __filename = fileURLToPath(import.meta.url);
const rootDir = path.join(path.dirname(__filename), '..');

// Print a colorful message
const printColorMessage = (message, color) => {
	const colors = {
		red: '\x1b[31m',
		green: '\x1b[32m',
		yellow: '\x1b[33m',
		blue: '\x1b[34m',
		magenta: '\x1b[35m',
		cyan: '\x1b[36m',
		reset: '\x1b[0m',
	};

	console.log(`${colors[color]}${message}${colors.reset}`);
};

// Function to draw a colored box around a message
const drawColorBox = (message, color) => {
	const colors = {
		red: '\x1b[31m',
		green: '\x1b[32m',
		yellow: '\x1b[33m',
		blue: '\x1b[34m',
		magenta: '\x1b[35m',
		cyan: '\x1b[36m',
		reset: '\x1b[0m',
	};

	const lines = message.split('\n');
	const maxLength = Math.max(...lines.map((line) => line.length));
	const horizontalLine = '─'.repeat(maxLength + 4);

	console.log(`${colors[color]}┌${horizontalLine}┐${colors.reset}`);
	for (const line of lines) {
		console.log(
			`${colors[color]}│  ${line.padEnd(maxLength)}  │${colors.reset}`,
		);
	}
	console.log(`${colors[color]}└${horizontalLine}┘${colors.reset}`);
};

// Function to check if Bun is installed
async function checkBunInstallation() {
	return new Promise((resolve) => {
		exec('bun --version', (error) => {
			if (error) {
				resolve(false); // Bun is not installed or not in PATH
			} else {
				resolve(true); // Bun is installed
			}
		});
	});
}

// Main function
async function main() {
	console.log('\n');
	printColorMessage('🚀 Creating a new MCP server project...', 'cyan');
	console.log('\n');

	const rl = readline.createInterface({ input: stdin, output: stdout });

	let projectName;
	let projectPath;

	while (true) {
		printColorMessage('What is the name of your project? ', 'blue');
		projectName = await rl.question(''); // Empty string as prompt, message already printed

		if (!projectName || projectName.trim() === '') {
			printColorMessage(
				'Project name cannot be empty. Please try again.',
				'yellow',
			);
			continue;
		}

		// Basic validation for project name
		if (!/^[a-zA-Z0-9_-]+$/.test(projectName)) {
			printColorMessage(
				'Invalid project name. Please use alphanumeric characters, hyphens, or underscores.',
				'yellow',
			);
			continue;
		}

		projectPath = path.join(process.cwd(), projectName);

		if (fs.existsSync(projectPath)) {
			printColorMessage(
				`A directory named '${projectName}' already exists. Please choose a different name.`,
				'yellow',
			);
			continue;
		}

		break;
	}

	rl.close();

	try {
		fs.mkdirSync(projectPath, { recursive: true });
		console.log(`📂 Created project directory: ${projectPath}`);

		copyProjectFiles(path.join(rootDir, 'templates', 'default'), projectPath);

		// Customize the copied package.json for the new project
		customizeProjectPackageJson(projectPath, projectName);

		printColorMessage('\n✅ Project created successfully!', 'green');
		printColorMessage('\nNext steps:', 'cyan');
		console.log('  1. Navigate to your project:');
		console.log(`     cd ${projectName}`);
		console.log('  2. Install dependencies:');
		console.log('     bun install');
		console.log('  3. Run "bun dev" to start the server');
		console.log('\nHappy coding! 🚀\n');

		// Check for Bun installation and provide a message if not found
		const hasBun = await checkBunInstallation();
		if (!hasBun) {
			const bunMessage = `
This project is configured to use Bun as its runtime and package manager.
It appears Bun is not installed on your system.

You can download Bun from: https://bun.sh/docs/installation

Alternatively, you can reconfigure the project's scripts in package.json
to use npm, yarn, or pnpm if you prefer.
      `;
			drawColorBox(bunMessage.trim(), 'yellow');
		}
	} catch (error) {
		printColorMessage(
			`\n❌ Error creating MCP server project: ${error.message}`,
			'red',
		);
		console.error(error);
		process.exit(1);
	}
}

// Function to copy files recursively
function copyProjectFiles(source, destination) {
	fs.mkdirSync(destination, { recursive: true });

	const entries = fs.readdirSync(source, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(source, entry.name);
		const destPath = path.join(destination, entry.name);

		if (entry.isDirectory()) {
			copyProjectFiles(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

// Customize the copied package.json for the new project
function customizeProjectPackageJson(targetPath, projectName) {
	const packageJsonPath = path.join(targetPath, 'package.json');

	if (!fs.existsSync(packageJsonPath)) {
		console.error(
			'Error: package.json not found in the target directory after copying.',
		);
		return;
	}

	const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
	const originalPackageJson = JSON.parse(packageJsonContent);

	// Update the project name
	originalPackageJson.name = projectName;

	// Update docker command names
	if (originalPackageJson.scripts) {
		if (originalPackageJson.scripts['docker:build']) {
			originalPackageJson.scripts['docker:build'] =
				`docker build -t ${projectName} .`;
		}
		if (originalPackageJson.scripts['docker:run']) {
			originalPackageJson.scripts['docker:run'] =
				`docker run --name ${projectName} -p \${PORT:-3697}:\${PORT:-3697} --env-file .env.local --env PORT=\${PORT:-3697} ${projectName}`;
		}
		if (originalPackageJson.scripts['docker:stop']) {
			originalPackageJson.scripts['docker:stop'] = `docker stop ${projectName}`;
		}
	}

	fs.writeFileSync(
		packageJsonPath,
		JSON.stringify(originalPackageJson, null, 2),
	);
	console.log(`📄 Customized ${packageJsonPath}`);
}

// Run the main function
main().catch((error) => {
	printColorMessage(`\n❌ Unexpected error: ${error.message}`, 'red');
	console.error(error);
	process.exit(1);
});
