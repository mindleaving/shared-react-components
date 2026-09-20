import { resolveText } from "../helpers/Globalizer";
import { apiClient } from "./ApiClient";
import { removeSurroundingQuotes } from "../helpers/StringExtensions";
import { showErrorAlert } from "../helpers/AlertHelpers";
import { QueryParameters } from "../types/frontendTypes";

export const downloadFile = async (url: string, params?: QueryParameters, body?: any, options?: { method: "GET" | "POST" }) => {
    try {
        let response: Response;
        if(options?.method === "POST") {
            response = await apiClient.instance!.post(url, body, params);
        } else {
            response = await apiClient.instance!.get(url, params);
        }
        const result = await response.blob();
        const contentDispositionHeader = response.headers.get("content-disposition");
        const filenameFromHeader = removeSurroundingQuotes(contentDispositionHeader
            ?.split(';')
            .map(x => x.trim())
            .find(x => x.toLowerCase().startsWith("filename="))
            ?.split('=')[1]
        );
        const filename = filenameFromHeader ?? 'document.bin';
        downloadBlob(result, filename);
    } catch(error: any) {
        showErrorAlert(resolveText("Download_CouldNotDownload"), error.message);
    }
}
export const downloadBlob = (data: Blob | MediaSource, filename: string) => {
    const anchor = document.createElement("a");
    document.body.appendChild(anchor);
    try {
        const objectUrl = window.URL.createObjectURL(data);
        anchor.href = objectUrl;
        anchor.download = filename;
        anchor.click();
        window.URL.revokeObjectURL(objectUrl);
    } finally {
        document.body.removeChild(anchor);
    }
}
export const downloadBase64 = (mimeType: string, base64encodedData: string, filename: string) => {
    const anchor = document.createElement("a");
    document.body.appendChild(anchor);
    const objectUrl = `data:${mimeType};base64,${base64encodedData}`;
    try {
        anchor.href = objectUrl;
        anchor.download = filename;
        anchor.click();
    } finally {
        document.body.removeChild(anchor);
    }
}