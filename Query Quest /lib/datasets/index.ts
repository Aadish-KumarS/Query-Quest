import { DatasetMeta } from "./types";
import { ecommerceDataset } from "./ecommerce";
import { companyDataset } from "./company";
import { streamingDataset } from "./streaming";

export * from "./types";
export { ecommerceDataset, companyDataset, streamingDataset };

export const allDatasets: Record<string, DatasetMeta> = {
  ecommerce: ecommerceDataset,
  company: companyDataset,
  streaming: streamingDataset,
};

export const defaultDataset = ecommerceDataset;

export function getDataset(id: string): DatasetMeta {
  return allDatasets[id] || ecommerceDataset;
}
