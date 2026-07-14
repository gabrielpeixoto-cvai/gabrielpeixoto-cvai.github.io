// Escape a string for use inside a YAML double-quoted scalar.
// Backslash must be escaped BEFORE quotes, otherwise the quote-escape
// backslashes would themselves get doubled.
export function yamlEscape(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
