import type { Request, Response } from "express";
import type { AdminRole } from "./adminAuth";
import { appendAudit, readState, writeState } from "./database";

export type RecordCollection =
  | "givingRecords"
  | "eventRegistrations"
  | "prayerRequests"
  | "visitPlans"
  | "contactMessages";

type StoredRecord = Record<string, unknown> & { id: string; status?: string };
type RecordStore = Record<RecordCollection, StoredRecord[]>;

const collections: RecordCollection[] = [
  "givingRecords",
  "eventRegistrations",
  "prayerRequests",
  "visitPlans",
  "contactMessages",
];

const collectionRoles: Record<RecordCollection, AdminRole[]> = {
  givingRecords: ["super-admin", "finance"],
  eventRegistrations: ["super-admin", "secretariat", "protocol"],
  prayerRequests: ["super-admin", "pastoral"],
  visitPlans: ["super-admin", "protocol", "secretariat"],
  contactMessages: ["super-admin", "secretariat"],
};

const requiredFields: Record<RecordCollection, string[]> = {
  givingRecords: ["donorName", "amount", "referenceCode"],
  eventRegistrations: ["eventName", "fullName", "phone"],
  prayerRequests: ["fullName", "requestText"],
  visitPlans: ["fullName", "phone"],
  contactMessages: ["fullName", "subject", "message"],
};

const allowedStatuses: Record<RecordCollection, string[]> = {
  givingRecords: ["pending-verification", "confirmed"],
  eventRegistrations: [],
  prayerRequests: ["new", "prayed", "archived"],
  visitPlans: ["planned", "welcomed", "followup-assigned"],
  contactMessages: ["unread", "read", "replied"],
};

const emptyStore = (): RecordStore => ({
  givingRecords: [],
  eventRegistrations: [],
  prayerRequests: [],
  visitPlans: [],
  contactMessages: [],
});

async function readStore(): Promise<RecordStore> {
  return { ...emptyStore(), ...readState("admin-records", emptyStore()) } as RecordStore;
}

async function writeStore(store: RecordStore) {
  writeState("admin-records", store);
}

function hasCollectionAccess(res: Response, collection: RecordCollection) {
  const role = res.locals.adminUser?.role as AdminRole | undefined;
  return role && collectionRoles[collection].includes(role);
}

function isCollection(value: string): value is RecordCollection {
  return collections.includes(value as RecordCollection);
}

export async function listAdminRecords(req: Request, res: Response) {
  const store = await readStore();
  const role = res.locals.adminUser?.role as AdminRole | undefined;
  const visibleStore = Object.fromEntries(
    collections.map((collection) => [
      collection,
      role && collectionRoles[collection].includes(role)
        ? store[collection]
        : [],
    ]),
  );
  res.json(visibleStore);
}

export async function createPublicRecord(req: Request, res: Response) {
  const { collection } = req.params;
  if (!isCollection(collection)) {
    res.status(404).json({ error: "Unknown record collection." });
    return;
  }

  const payload = req.body;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    res.status(400).json({ error: "A record object is required." });
    return;
  }

  const missingField = requiredFields[collection].find(
    (field) =>
      payload[field] === undefined ||
      payload[field] === null ||
      String(payload[field]).trim() === "",
  );
  if (missingField) {
    res.status(400).json({ error: `Missing required field: ${missingField}.` });
    return;
  }

  const store = await readStore();
  const record = {
    ...payload,
    id:
      typeof payload.id === "string"
        ? payload.id
        : `${collection}-${Date.now()}`,
  } as StoredRecord;
  store[collection] = [record, ...store[collection]];
  await writeStore(store);
  appendAudit("public-submission", "create", collection, record.id);
  res.status(201).json({ record });
}

export async function updateRecordStatus(req: Request, res: Response) {
  const { collection, id } = req.params;
  if (!isCollection(collection)) {
    res.status(404).json({ error: "Unknown record collection." });
    return;
  }
  if (!hasCollectionAccess(res, collection)) {
    res
      .status(403)
      .json({ error: "Insufficient permissions for this record type." });
    return;
  }

  const status = String(req.body?.status || "");
  if (!allowedStatuses[collection].includes(status)) {
    res.status(400).json({ error: "A valid status is required." });
    return;
  }

  const store = await readStore();
  const record = store[collection].find((item) => item.id === id);
  if (!record) {
    res.status(404).json({ error: "Record not found." });
    return;
  }

  record.status = status;
  await writeStore(store);
  appendAudit(
    String(res.locals.adminUser.email),
    "status-update",
    collection,
    id,
  );
  res.json({ record });
}
