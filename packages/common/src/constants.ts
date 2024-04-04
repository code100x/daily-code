interface SupportedLangauges {
  javascript: string;
  "c++": string;
  [key: string]: string;
}

export const LANGUAGE_VERSIONS: SupportedLangauges = {
  javascript: "18.15.0",
  "c++": "10.2.0",
};

export const CODE_SNIPPETS: SupportedLangauges = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  "c++": `\n#include <iostream>\n\nint main() {\n\tstd::cout << "Hello, World!" << std::endl;\n\treturn 0;\n}\n`,
};
