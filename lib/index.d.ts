export function fromStringV2(
    opts: Opts,
    clbk: (err: Error | null, body: Record<string, any>) => void,
    dest: string | undefined
): void;

export function fromFileV2(
    srcFile: string,
    opts: Opts,
    clbk: (err: Error | null, body: Record<string, any>) => void,
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