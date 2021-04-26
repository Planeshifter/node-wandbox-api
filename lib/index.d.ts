export function fromStringV2(
    opts: Array<String>,
    clbk: (err: Error | null, body: Record<string, any>) => void,
    dest: string | undefined
): void;

export function fromFileV2(
    srcFile: string,
    opts: Array<String>,
    clbk: (err: Error | null, body: Record<string, any>) => void,
    dest: string | undefined
): void;
