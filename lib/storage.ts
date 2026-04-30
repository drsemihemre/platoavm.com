import fs from "node:fs/promises";
import path from "node:path";
import type { Store, Service, Event, Site } from "./data";

const DATA_DIR = path.join(process.cwd(), "data");

const RUNTIME_DIR = process.env.PLATO_DATA_DIR
  ? path.resolve(process.env.PLATO_DATA_DIR)
  : DATA_DIR;

async function readJson<T>(file: string): Promise<T> {
  try {
    const overridePath = path.join(RUNTIME_DIR, file);
    const data = await fs.readFile(overridePath, "utf-8");
    return JSON.parse(data) as T;
  } catch {
    const data = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(data) as T;
  }
}

async function writeJson(file: string, data: unknown) {
  const target = RUNTIME_DIR === DATA_DIR ? RUNTIME_DIR : RUNTIME_DIR;
  await fs.mkdir(target, { recursive: true });
  await fs.writeFile(path.join(target, file), JSON.stringify(data, null, 2), "utf-8");
}

export async function getStores() {
  return readJson<Store[]>("stores.json");
}
export async function getServices() {
  return readJson<Service[]>("services.json");
}
export async function getEvents() {
  return readJson<Event[]>("events.json");
}
export async function getSiteData() {
  return readJson<Site>("site.json");
}

export async function saveStores(stores: Store[]) {
  return writeJson("stores.json", stores);
}
export async function saveServices(services: Service[]) {
  return writeJson("services.json", services);
}
export async function saveEvents(events: Event[]) {
  return writeJson("events.json", events);
}
export async function saveSiteData(site: Site) {
  return writeJson("site.json", site);
}

export const isReadOnly = !process.env.PLATO_DATA_DIR && process.env.VERCEL === "1";
