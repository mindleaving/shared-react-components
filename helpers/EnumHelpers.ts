export const compareEnum = (a: string | null | undefined, b: string | null | undefined) => {
    if(!a && !b) {
        return true;
    }
    if(!a || !b) {
        return false;
    }
    return normalizeEnumValue(a) === normalizeEnumValue(b);
}
export const isEnumInSet = (enumValue: string, set: string[]) => {
    const normalizedEnumValue = normalizeEnumValue(enumValue);
    return set.some(setValue => normalizedEnumValue === normalizeEnumValue(setValue));
}
export const normalizeEnumValue = (enumValue: string) => {
    return enumValue.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}