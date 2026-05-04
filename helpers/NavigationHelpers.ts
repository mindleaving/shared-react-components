import { NavigateFunction } from "react-router-dom";

export const isExternalUrl = (url: string) => {
    return url.startsWith("https://") || url.startsWith("http://");
}
export const openLink = (url: string, navigate: NavigateFunction) => {
    if(isExternalUrl(url)) {
        window.location.href = url;
    } else {
        navigate(url);
    }
}