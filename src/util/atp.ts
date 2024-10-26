import type { ComAtprotoRepoCreateRecord, Records } from "@atcute/client/lexicons";
import { session } from "../session.ts";

type RecordType = keyof Records;

export interface CreateRecordOptions<K extends RecordType> {
  repo: string;
  collection: K;
  record: Records[K];
  rkey?: string;
  swapCommit?: string;
  validate?: boolean;
}

export async function createRecord<K extends RecordType>(
  options: CreateRecordOptions<K>,
): Promise<ComAtprotoRepoCreateRecord.Output> {
  const { data } = await session!.xrpc.call("com.atproto.repo.createRecord", { data: options });
  return data;
}

export interface DeleteRecordOptions<K extends RecordType> {
  repo: string;
  collection: K;
  rkey: string;
  swapCommit?: string;
  swapRecord?: string;
}

export async function deleteRecord<K extends RecordType>(options: DeleteRecordOptions<K>) {
  await session!.xrpc.call("com.atproto.repo.deleteRecord", { data: options });
}
