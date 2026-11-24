export enum OrderDirection {
    Ascending = "Ascending",
    Descending = "Descending"
}
export enum ApiClientStatus {
  NotLoggedIn = "NotLoggedIn",
  LoginOnly = "LoginOnly",
  LoggedIntoAccount = "LoggedIntoAccount",
  ServerUnavailable = "ServerUnavailable"
}
export enum LoginCheckResult {
    LoggedIn = "LoggedIn",
    NotLoggedIn = "NotLoggedIn",
    Unknown = "Unknown"
}
export enum MenschIdLoginStep {
    EnterMenschId = 'enterMenschId',
    Challenge = 'challenge',
    Rejected = 'rejected',
    Expired = 'expired',
    Invalid = 'invalid',
}
export enum LogoutScope {
    CurrentSession = 'currentSession',
    Everywhere = 'everywhere',
}