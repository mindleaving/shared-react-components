import { toDictionary } from "./Transformations";

interface Translation {
    language: string;
    [key: string]: string;
}

export class Globalizer {
    preferedLanguage: string;
    defaultLanguage: string;
    translations: { [language:string] : Translation };

    constructor(
        preferedLanguages: readonly string[],
        defaultLanguage: string,
        translations: Translation[]) {
            const availableLanguages = translations.map(x => x.language.toLocaleLowerCase());
            this.defaultLanguage = defaultLanguage.toLocaleLowerCase();
            this.preferedLanguage = this.selectPreferedLanguage(
                preferedLanguages, 
                availableLanguages,
                this.defaultLanguage);
            this.translations = toDictionary(translations, x => x.language.toLocaleLowerCase());
    }

    selectPreferedLanguage = (
        preferedLanguages: readonly string[], 
        availableLanguages: string[], 
        defaultLanguage: string): string => {

        const matchingPreferedLanguage = preferedLanguages
            .map(language => language.toLocaleLowerCase())
            .find(language => availableLanguages.includes(language));
        return matchingPreferedLanguage ?? defaultLanguage;
    }

    canResolveText = (resourceId: string) => {
        const preferedTranslation = this.tryGetResourceDictionary(this.preferedLanguage);
        if(preferedTranslation && preferedTranslation[resourceId]) {
            return true;
        }
        const defaultTranslation = this.tryGetResourceDictionary(this.defaultLanguage);
        if(defaultTranslation && defaultTranslation[resourceId]) {
            return true;
        }
        return false;
    }

    resolveText = (resourceId: string) => {
        const preferedTranslation = this.tryGetResourceDictionary(this.preferedLanguage);
        if(preferedTranslation && preferedTranslation[resourceId]) {
            return preferedTranslation[resourceId];
        }
        const defaultTranslation = this.tryGetResourceDictionary(this.defaultLanguage);
        if(defaultTranslation && defaultTranslation[resourceId]) {
            return defaultTranslation[resourceId];
        }
        throw new Error(`Cannot resolve resource '${resourceId}'`);
    }

    tryGetResourceDictionary = (language: string): { [key: string]: string } | undefined => {
        return this.translations[language];
    }
}
export const defaultGlobalizer: { instance?: Globalizer } = {}

export function setLanguage(languageId: string): void {
    defaultGlobalizer.instance!.preferedLanguage = languageId.toLocaleLowerCase();
}
export function getPreferedLanguage(): string {
    return defaultGlobalizer.instance!.preferedLanguage;
}
export function getFallbackLanguage(): string {
    return defaultGlobalizer.instance!.defaultLanguage;
}
export function canResolveText(resourceId: string): boolean {
    return defaultGlobalizer.instance!.canResolveText(resourceId);
}
export function resolveText(resourceId: string): string {
    return defaultGlobalizer.instance!.resolveText(resourceId);
}