import { getMonth, getDate, getYear, isSameDay, isLeapYear, format, parse } from "date-fns";

export const isBirthday = (date: Date, birthDate: Date) => {
    const isSameDateAndMonth = getMonth(date) === getMonth(birthDate) && getDate(date) === getDate(birthDate);
    if(isSameDateAndMonth) {
        return true;
    }
    // Check for birthday on 29th of February which only exists in leap years
    // If current year is not a leap year, report birthday on 1st of March
    // Beware JS quirk: months are zero-indexed -> 0 = January, 1 = February,...
    const is29thOfFebruary = getMonth(birthDate) === 1 && getDate(birthDate) === 29;
    if(is29thOfFebruary && !isLeapYear(date)) {
        return isSameDay(date, new Date(getYear(date), 2, 1));
    }
    return false;
}
export const toDateOnly = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
}
export const toTimeOnly = (date: Date): string => {
    return format(date, 'HH:mm:ss');
}
export const isValidDate = (date: Date) => {
    return !isNaN(date.getTime());
}
export const getLocaleDatePattern = (locale: string): string => {
    const parts = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
        .formatToParts(new Date(2000, 10, 22));
    return parts.map(part => {
        switch(part.type) {
            case 'day':
            {
                return 'dd';
            }
            case 'month':
            {
                return 'MM';
            }
            case 'year':
            {
                return 'yyyy';
            }
            default:
            {
                return part.value;
            }
        }
    }).join('');
}
export const parseDateInput = (input: string, locale: string, enableTime?: boolean): Date | undefined => {
    const trimmedInput = input.trim();
    if(!trimmedInput) {
        return undefined;
    }
    const locales = [ locale, ...(typeof navigator !== 'undefined' ? navigator.languages : []) ];
    const localeDatePatterns = locales.map(x => {
        try {
            return getLocaleDatePattern(x).replace('dd', 'd').replace('MM', 'M');
        } catch {
            return undefined;
        }
    }).filter(x => !!x) as string[];
    const datePatterns = [ ...new Set([ 'yyyy-M-d', ...localeDatePatterns, 'd.M.yyyy' ]) ];
    const patterns = enableTime
        ? datePatterns.flatMap(datePattern => [ `${datePattern} H:mm`, `${datePattern}, H:mm`, datePattern ])
        : datePatterns;
    const referenceDate = new Date();
    for (const pattern of patterns) {
        const parsedDate = parse(trimmedInput, pattern, referenceDate);
        if(isValidDate(parsedDate)) {
            return parsedDate;
        }
    }
    return undefined;
}
