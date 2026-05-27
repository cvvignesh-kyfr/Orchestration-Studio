export type YAMLValue = 
  | string 
  | number 
  | boolean 
  | null 
  | undefined 
  | YAMLValue[] 
  | { [key: string]: YAMLValue };

/**
 * A simple, robust, strictly-typed YAML stringifier helper.
 */
export function toYAML(obj: YAMLValue, indent: number = 0): string {
  const spaces = " ".repeat(indent);
  if (obj === null) return "null";
  if (typeof obj === "undefined") return "undefined";
  if (typeof obj === "string") {
    if (obj.includes("\n") || obj.includes(":") || obj.includes("-") || obj.includes('"') || obj.includes("'")) {
      return `"${obj.replace(/"/g, '\\"')}"`;
    }
    return obj;
  }
  if (typeof obj === "number" || typeof obj === "boolean") {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return "\n" + obj.map(item => `${spaces}- ${toYAML(item, indent + 2).trim()}`).join("\n");
  }
  if (typeof obj === "object") {
    const keys = Object.keys(obj);
    if (keys.length === 0) return "{}";
    return "\n" + keys.map(key => {
      const valStr = toYAML(obj[key], indent + 2);
      if (valStr.startsWith("\n")) {
        return `${spaces}${key}:${valStr}`;
      }
      return `${spaces}${key}: ${valStr}`;
    }).join("\n");
  }
  return "";
}
