import type { FastMCP } from 'fastmcp';
import { goodbyeTool, helloWorldTool } from './tool-example';

/**
 * Register all tools with the MCP server
 *
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP) {
	server.addTool(helloWorldTool);
	server.addTool(goodbyeTool);
}
