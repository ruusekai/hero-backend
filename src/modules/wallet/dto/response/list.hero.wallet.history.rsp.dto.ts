import { HeroWalletHistoryDto } from '../entity/hero.wallet.history.dto';

export class ListHeroWalletHistoryRspDto {
  constructor(history: HeroWalletHistoryDto[]) {
    this.history = history;
  }
  history: HeroWalletHistoryDto[];
}
