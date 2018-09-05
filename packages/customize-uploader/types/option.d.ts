import { Lang } from '../src/lang';

export interface Option {
  watch?: string,
  lang: Lang,
  proxy: string,
  guestSpaceId: number
}
