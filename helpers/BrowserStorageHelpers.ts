export const getSessionStorageItem = <T extends unknown>(id: string, defaultItem?: T): T | undefined => {
    const item = sessionStorage.getItem(id);
    if(item) {
        return JSON.parse(item);
    }
    return defaultItem;
}
export const getLocalStorageItem = <T extends unknown>(id: string, defaultItem?: T): T | undefined => {
    const item = localStorage.getItem(id);
    if(item) {
        return JSON.parse(item);
    }
    return defaultItem;
}