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
	printColorMessage('✨ Welcome to the MCP Server Project Creator! ✨', 'magenta');
	printColorMessage('🚀 Let\'s get your new project set up!', 'cyan');
	console.log('\n');

	let projectName;
	let projectPath; // This will be set after projectName is determined

	// Check if project name is provided as a command-line argument
	const args = process.argv.slice(2); // Skip 'node' and 'index.mjs'

	if (args.length > 0) {
		projectName = args[0];
		printColorMessage(`Using project name from arguments: ${projectName}`, 'blue');
		// Perform validation for the provided project name directly
		if (!projectName || projectName.trim() === '') {
			printColorMessage(
				'⚠️ Project name cannot be empty. Please provide a valid name.',
				'red',
			);
			process.exit(1);
		}
		if (!/^[a-zA-Z0-9_-]+$/.test(projectName)) {
			printColorMessage(
				'🚫 Invalid project name. Please use alphanumeric characters, hyphens, or underscores.',
				'red',
			);
			process.exit(1);
		}
		projectPath = path.join(process.cwd(), projectName);
		if (fs.existsSync(projectPath)) {
			printColorMessage(
				`🛑 A directory named '${projectName}' already exists here. Please choose a different name.`, 
				'red',
			);
			process.exit(1);
		}

	} else {
		const rl = readline.createInterface({ input: stdin, output: stdout });
		while (true) {
			printColorMessage('❓ What is the name of your new project? ', 'blue');
			projectName = await rl.question(''); // Empty string as prompt, message already printed

			if (!projectName || projectName.trim() === '') {
				printColorMessage(
					'⚠️ Project name cannot be empty. Please try again.',
					'yellow',
				);
				continue;
			}

			// Basic validation for project name
			if (!/^[a-zA-Z0-9_-]+$/.test(projectName)) {
				printColorMessage(
					'🚫 Invalid project name. Please use alphanumeric characters, hyphens, or underscores.',
					'yellow',
				);
				continue;
			}

			projectPath = path.join(process.cwd(), projectName);

			if (fs.existsSync(projectPath)) {
				printColorMessage(
					`🛑 A directory named '${projectName}' already exists here. Please choose a different name.`,
					'yellow',
				);
				continue;
			}

			break;
		}
		rl.close(); // Close readline only if it was used
	}

	// Now that projectName is determined, set projectPath if not already set (for direct argument case)
	// If projectName was provided via arguments, projectPath is already set and validated above.
	// If prompted, projectPath is also set and validated inside the loop.
	// This line is redundant if validation always sets projectPath, but harmless.
	if (!projectPath) {
		projectPath = path.join(process.cwd(), projectName);
	}

	try {
		printColorMessage(`Creating project directory: ${projectPath}`, 'blue');
		fs.mkdirSync(projectPath, { recursive: true });
		console.log(`✅ Project directory created!`);

		printColorMessage('Copying template files...', 'blue');
		copyProjectFiles(path.join(rootDir, 'templates', 'default'), projectPath);
		console.log('✅ Template files copied!');

		printColorMessage('Customizing package.json...', 'blue');
		// Customize the copied package.json for the new project
		customizeProjectPackageJson(projectPath, projectName);
		console.log('✅ package.json customized!');

		printColorMessage('\n🎉 Project created successfully!', 'green');
		printColorMessage('\nNext steps:', 'cyan');
		const nextStepsMessage = `
  1. 📁 Navigate into your new project folder:
     \`cd ${projectName}\`

  2. 📦 Install dependencies:
     \`bun install\`

  3. 🚀 Start the development server:
     \`bun dev\`

Happy coding! 🎉
`;
		drawColorBox(nextStepsMessage.trim(), 'cyan');

		// Check for Bun installation and provide a message if not found
		const hasBun = await checkBunInstallation();
		if (!hasBun) {
			const bunMessage = `
--- ℹ️ IMPORTANT: Bun Not Found ---
This project is optimized for Bun! It appears Bun is not installed on your system.

You can download Bun from: https://bun.sh/docs/installation

Alternatively, you can reconfigure the project's scripts in package.json
to use npm, yarn, or pnpm if you prefer.
----------------------------------
      `;
			drawColorBox(bunMessage.trim(), 'yellow');
		}
	} catch (error) {
		printColorMessage(
			`\n❌ Oh no! An error occurred: ${error.message}`,
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
			'❌ Error: package.json not found in the target directory after copying.',
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
	printColorMessage(`📄 Updated ${packageJsonPath}`, 'blue');
}

// Run the main function
main().catch((error) => {
	printColorMessage(`\n💥 An unexpected error occurred: ${error.message}`, 'red');
	console.error(error);
	process.exit(1);
});