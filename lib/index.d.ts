export function fromStringV2(
    opts: Opts,
    clbk: (err: Error | null, body: Result) => void,
    dest: string | undefined
): void;

export function fromFileV2(
    srcFile: string,
    opts: Opts,
    clbk: (err: Error | null, body: Result) => void,
    dest: string | undefined
): void;

export function fromStringV3( opts: Opts ): Result | string;
export function fromFileV3(
    srcFile: string,
    opts: Opts
): Result | string;

export function getCompilers(
    lang?: string
): Compiler[] | "No matching compilers found";

interface Opts {
    compiler: string,
    code: string,
    save: boolean,
    codes?: Array<string>,
    options?: string,
    stdin?: string,
    "compiler-option-raw"?: string,
    "runtime-option-raw"?: string,
}

interface Result {
    status: number,
    signal: string,
    "compiler_output": string,
    "compiler_error": string,
    "compiler_message": string,
    "program_output": string,
    "program_error": string,
    "program_message": string,
    "api_output": string,
    "api_error": string,
    "api_message": string,
    permlink?: string,
    url?: string
}

interface Switch {
	default: boolean;
	"display-flags": string;
	"display-name": string;
	name: string;
	type: string;
}

interface Compiler {
	"compiler-option-raw": boolean;
	"display-compile-command": string;
	"display-name": string;
	language: string;
	name: string;
	provider: number;
	"runtime-option-raw": boolean;
	switches: Array<Switch>;
	templates: Array<string>;
	version: string;
}
