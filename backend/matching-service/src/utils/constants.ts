/* Websocket Match Events */
// Receive
export const MATCH_REQUEST = "match_request";
export const CANCEL_MATCH_REQUEST = "cancel_match_request";
export const MATCH_ACCEPT_REQUEST = "match_accept_request";
export const MATCH_DECLINE_REQUEST = "match_decline_request";
export const REMATCH_REQUEST = "rematch_request";
export const MATCH_END_REQUEST = "match_end_request";

export const USER_CONNECTED = "user_connected";
export const USER_DISCONNECTED = "user_disconnected";
export const SOCKET_DISCONNECT = "disconnect";
export const SOCKET_CLIENT_DISCONNECT = "client namespace disconnect";

// Send
export const MATCH_FOUND = "match_found";
export const MATCH_SUCCESSFUL = "match_successful";
export const MATCH_UNSUCCESSFUL = "match_unsuccessful";
export const MATCH_ENDED = "match_ended";
export const MATCH_REQUEST_EXISTS = "match_request_exists";
export const MATCH_REQUEST_ERROR = "match_request_error";
