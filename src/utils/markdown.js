export function extractHeadings(markdown = "") {
  return markdown
    .split("\n")
    .filter((line) => /^#{1,3}\s+/.test(line))
    .map((line) => {
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#{1,3}\s+/, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return { level, text, id };
    });
}
