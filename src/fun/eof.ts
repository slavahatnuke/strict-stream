
export type IamEOF = {}
export const EOF: IamEOF = {}

export function isEOF(value: any): value is IamEOF {
    return value === EOF
}
