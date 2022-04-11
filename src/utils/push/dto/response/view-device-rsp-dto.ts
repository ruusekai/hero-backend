export class ViewDeviceRspDto {
  id: string;
  identifier: string;
  session_count: number;
  language: string;
  timezone: number;
  game_version: string;
  device_os: string;
  device_type: number;
  device_model: string;
  ad_id: string;
  tags: any;
  last_active: number;
  playtime: number;
  amount_spent: number;
  created_at: number;
  invalid_identifier: boolean;
  badge_count: number;
  sdk: string;
  test_type: string;
  ip: string;
  external_user_id: string;
  errors: string[];
}
