export function fromString( opts: Opts ): Promise<Result>;
export function fromFile(
    srcFile: string,
    opts: Opts
): Promise<Result>;

export function getCompilers(
    lang?: string
): Promise<Compiler[] | string>;

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
