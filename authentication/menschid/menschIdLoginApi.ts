import { MenschIdChallengeStatus } from "../../../localComponents/types/enums";
import { Models } from "../../../localComponents/types/models";
import { apiClient } from "../../communication/ApiClient";
import { getMenschIdChallengePath } from "../../helpers/MenschIdHelpers";

export const startMenschIdChallenge = async (
    apiBasePath: string,
    menschId: string,
): Promise<Models.MenschId.StartMenschIdChallengeResponse> => {
    const response = await apiClient.instance!.post(`${apiBasePath}/challenges`, { menschId });
    return await response.json() as Models.MenschId.StartMenschIdChallengeResponse;
};

export const getMenschIdChallengeStatus = async (
    apiBasePath: string,
    challengeId: string,
): Promise<MenschIdChallengeStatus> => {
    const statusPath = getMenschIdChallengePath(apiBasePath, challengeId, 'status');
    const response = await apiClient.instance!.get(statusPath);
    const statusResponse = await response.json() as Models.MenschId.MenschIdChallengeStatusResponse;
    return statusResponse.status;
};
