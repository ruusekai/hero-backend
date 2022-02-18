export class PushMessageDto {
  constructor(
    app_id: string,
    include_player_ids: string[],
    headings: any,
    contents: any,
    data: any,
  ) {
    this.app_id = app_id;
    this.include_player_ids = include_player_ids;
    this.headings = headings;
    this.contents = contents;
    this.data = data;
  }
  app_id: string;
  include_player_ids: string[];
  headings: any;
  contents: any;
  data: any;
}
