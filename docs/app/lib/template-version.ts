// The template release this site documents, read from TEMPLATE_VERSION at build time.
import raw from "../../TEMPLATE_VERSION?raw";

export const templateVersion = raw.trim();
