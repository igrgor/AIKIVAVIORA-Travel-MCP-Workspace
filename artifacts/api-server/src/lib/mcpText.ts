export type McpContentBlock = {
  type: string;
  text?: string;
};

export type McpToolResult = {
  isError: boolean;
  content: McpContentBlock[];
};

export function extractMcpText(result: McpToolResult): string {
  const chunks = result.content
    .filter((block) => block.type === "text" && block.text)
    .map((block) => block.text as string);

  if (result.isError) {
    return chunks.join("\n\n") || "Weather MCP returned an error.";
  }

  return chunks.join("\n\n") || "";
}
