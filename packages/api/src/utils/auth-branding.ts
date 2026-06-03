import { publicCmsService } from "../services/public-cms.service";
import { asList } from "../utils";
import { pickLocalized } from "../utils/locale";

export type AuthInfoBlock = {
  title: string;
  body: string;
};

export async function loadAuthInfoBlocks(locale: string): Promise<AuthInfoBlock[]> {
  try {
    const [whoUsData, whyUsData] = await Promise.all([
      publicCmsService.whoUs(),
      publicCmsService.whyUs(),
    ]);

    const whoItems = asList(whoUsData)
      .filter((item) => item.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
    const whyItems = asList(whyUsData)
      .filter((item) => item.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);

    const blocks: AuthInfoBlock[] = [];

    for (const item of whoItems.slice(0, 2)) {
      blocks.push({
        title: pickLocalized(locale, item.title_ar, item.title_en),
        body: pickLocalized(locale, item.body_ar, item.body_en),
      });
    }

    for (const item of whyItems.slice(0, 2)) {
      blocks.push({
        title: pickLocalized(locale, item.title_ar, item.title_en),
        body: pickLocalized(locale, item.body_ar, item.body_en),
      });
    }

    return blocks;
  } catch {
    return [];
  }
}
