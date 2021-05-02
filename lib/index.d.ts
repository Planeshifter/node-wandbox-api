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
    permlink?: string,
    url?: string
}
