// The components the documented template release ships. sync:template writes
// shipped-components.txt from the release tag.
import raw from "./shipped-components.txt?raw";

export const shippedComponents = raw.split("\n").filter(Boolean);
