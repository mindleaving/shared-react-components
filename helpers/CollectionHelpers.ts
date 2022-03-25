export const groupBy = <T extends unknown>(collection: T[], keySelector: (item: T) => string) => {
    const groups: { [k: string]: T[] } = {};
    for (const item of collection) {
        const key = keySelector(item);
        if(!groups[key]) {
            groups[key] = [];
        };
        groups[key].push(item);
    }
    return Object.keys(groups).map(key => ({
        key: key,
        items: groups[key]
    }));
}
export const mostCommonValue = <T extends string | number>(collection: T[]): T | undefined => {
    const distinctItems: { [key: string | number]: number } = {};
    let maxCount  = 0;
    let maxCountItem: T | undefined = undefined;
    for (const item of collection) {
        if(distinctItems[item] == null) {
            distinctItems[item] = 0;
        }
        const currentCount = distinctItems[item]
        distinctItems[item] = currentCount + 1;
        if(currentCount+1 > maxCount) {
            maxCount = currentCount+1;
            maxCountItem = item;
        }
    }
    return maxCountItem;
}