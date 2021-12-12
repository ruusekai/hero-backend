export class FacebookDebugTokenRspDto {
  app_id: string;
  type: string;
  application: string;
  data_access_expires_at: number;
  expires_at: number;
  is_valid: boolean;
  scopes: string[];
  user_id: string;
  error: { code: number; message: string; subcode: number };
}

// {
//   "app_id": "664117767917186",
//     "type": "USER",
//     "application": "testing",
//     "data_access_expires_at": 1646998920,
//     "expires_at": 1639227600,
//     "is_valid": true,
//     "scopes": [
//     "email",
//     "public_profile"
//   ],
//     "user_id": "10228604863005643"
// }

//
// {
//   "app_id": "664117767917186",
//   "type": "USER",
//   "application": "testing",
//   "data_access_expires_at": 1647022311,
//   "error": {
//   "code": 190,
//     "message": "Error validating access token: Session has expired on Saturday, 11-Dec-21 05:00:00 PST. The current time is Saturday, 11-Dec-21 10:13:30 PST.",
//     "subcode": 463
// },
//   "expires_at": 1639227600,
//   "is_valid": false,
//   "scopes": [
//   "email",
//   "public_profile"
// ],
//   "user_id": "10228604863005643"
// }
