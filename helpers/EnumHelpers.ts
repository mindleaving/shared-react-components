export const compareEnum = (a: string, b: string) => {
    return normalizeEnumValue(a) === normalizeEnumValue(b);
}
export const isEnumInSet = (enumValue: string, set: string[]) => {
    const normalizedEnumValue = normalizeEnumValue(enumValue);
    return set.some(setValue => normalizedEnumValue === normalizeEnumValue(setValue));
}
export const normalizeEnumValue = (enumValue: string) => {
    return enumValue.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}