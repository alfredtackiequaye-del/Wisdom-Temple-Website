import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { Request, Response, NextFunction } from "express";
import { readState, writeState } from "./database";

export type AdminRole =
  | "super-admin"
  | "pastoral"
  | "finance"
  | "secretariat"
  | "protocol";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel: string;
  phone?: string;
  isActive: boolean;
  passwordHash: string;
  createdAt: string;
  lastLogin?: string;
}

interface Session {
  userId: string;
  expiresAt: number;
}

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const SESSION_COOKIE = "wt_admin_session";
const dataPath = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), ".data"), "admin-users.json");
const sessions = new Map<string, Session>();

const seedUsers = [
  {
    id: "staff-1",
    name: "Rev. Gabriel Dela",
    email: process.env.ADMIN_EMAIL || "shepherd@wisdomtemple.org",
    role: "super-admin" as const,
    roleLabel: "Senior Minister & Head Administrator",
    phone: "+233 24 500 9764",
    password:
      process.env.ADMIN_PASSWORD ||
      (process.env.NODE_ENV === "production" ? "" : "7788"),
  },
];

function hashPassword(
  password: string,
  salt = crypto.randomBytes(16).toString("hex"),
) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, expectedHex] = storedHash.split(":");
  if (!salt || !expectedHex) return false;
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(actual, expected)
  );
}

async function readUsers(): Promise<AdminUser[]> {
  const storedUsers = readState<AdminUser[] | null>("admin-users", null);
  if (storedUsers) return storedUsers;

  try {
    const raw = await fs.readFile(dataPath, "utf8");
    const users = JSON.parse(raw) as AdminUser[];
    writeState("admin-users", users);
    return users;
  } catch {
    if (!seedUsers[0].password) {
      throw new Error(
        "ADMIN_PASSWORD must be configured before creating production admin credentials.",
      );
    }
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    const users: AdminUser[] = seedUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleLabel: user.roleLabel,
      phone: user.phone,
      isActive: true,
      passwordHash: hashPassword(user.password),
      createdAt: new Date().toISOString(),
    }));
    await fs.writeFile(dataPath, JSON.stringify(users, null, 2), "utf8");
    writeState("admin-users", users);
    return users;
  }
}

async function writeUsers(users: AdminUser[]) {
  writeState("admin-users", users);
}

function publicUser(user: AdminUser) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

function setSessionCookie(res: Response, token: string) {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  );
}

function clearSessionCookie(res: Response) {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`,
  );
}

function readSessionToken(req: Request) {
  const cookieHeader = req.headers.cookie || "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return cookie?.slice(`${SESSION_COOKIE}=`.length);
}

const MIN_PASSWORD_LENGTH = 8;

export async function loginAdmin(req: Request, res: Response) {
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password || "");
  const users = await readUsers();
  const user = users.find(
    (candidate) => candidate.email.toLowerCase() === email,
  );

  if (!user || !user.isActive || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid staff credentials." });
    return;
  }

  // Drop expired sessions so the in-memory map can't grow without bound.
  for (const [key, value] of sessions) {
    if (value.expiresAt <= Date.now()) sessions.delete(key);
  }

  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    userId: user.id,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  user.lastLogin = new Date().toISOString();
  await writeUsers(users);
  setSessionCookie(res, token);
  res.json({ user: publicUser(user) });
}

export function logoutAdmin(req: Request, res: Response) {
  const token = readSessionToken(req);
  if (token) sessions.delete(token);
  clearSessionCookie(res);
  res.status(204).end();
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = readSessionToken(req);
  const session = token ? sessions.get(token) : undefined;
  if (!session || session.expiresAt <= Date.now()) {
    if (token) sessions.delete(token);
    res.status(401).json({ error: "Admin authentication required." });
    return;
  }

  const users = await readUsers();
  const user = users.find(
    (candidate) => candidate.id === session.userId && candidate.isActive,
  );
  if (!user) {
    sessions.delete(token!);
    res.status(401).json({ error: "Admin account is inactive." });
    return;
  }

  res.locals.adminUser = publicUser(user);
  next();
}

export async function getAdminSession(req: Request, res: Response) {
  await requireAdmin(req, res, () => {
    res.json({ user: res.locals.adminUser });
  });
}

export function requireRole(...roles: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.adminUser as { role?: AdminRole } | undefined;
    if (!user || !roles.includes(user.role as AdminRole)) {
      res
        .status(403)
        .json({ error: "Insufficient administrator permissions." });
      return;
    }
    next();
  };
}

const roleLabels: Record<AdminRole, string> = {
  "super-admin": "Senior Minister & Head Administrator",
  finance: "Treasury & Accounts Officer",
  pastoral: "Pastoral Care & Prayer Lead",
  secretariat: "Secretariat & Correspondence",
  protocol: "Protocol & Guest Reception",
};

export async function listStaff(_req: Request, res: Response) {
  const users = await readUsers();
  res.json({ users: users.map(publicUser) });
}

export async function createStaff(req: Request, res: Response) {
  const { name, email, phone, role, password } = req.body || {};
  if (!name || !email || !password || !Object.hasOwn(roleLabels, role)) {
    res
      .status(400)
      .json({ error: "Name, email, role, and password are required." });
    return;
  }

  if (String(password).length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
    return;
  }

  const users = await readUsers();
  if (
    users.some(
      (user) => user.email.toLowerCase() === String(email).trim().toLowerCase(),
    )
  ) {
    res
      .status(409)
      .json({ error: "A staff account with that email already exists." });
    return;
  }

  const user: AdminUser = {
    id: `staff-${crypto.randomUUID()}`,
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: phone ? String(phone).trim() : undefined,
    role,
    roleLabel: roleLabels[role as AdminRole],
    isActive: true,
    passwordHash: hashPassword(String(password)),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeUsers(users);
  res.status(201).json({ user: publicUser(user) });
}

export async function updateStaff(req: Request, res: Response) {
  const users = await readUsers();
  const user = users.find((candidate) => candidate.id === req.params.id);
  if (!user) {
    res.status(404).json({ error: "Staff account not found." });
    return;
  }
  if (req.body?.isActive === false && user.id === res.locals.adminUser?.id) {
    res.status(400).json({ error: "You can't suspend your own account." });
    return;
  }
  if (req.body?.password && String(req.body.password).length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
    return;
  }
  if (typeof req.body?.isActive === "boolean")
    user.isActive = req.body.isActive;
  if (req.body?.password)
    user.passwordHash = hashPassword(String(req.body.password));
  await writeUsers(users);
  res.json({ user: publicUser(user) });
}

export async function removeStaff(req: Request, res: Response) {
  const users = await readUsers();
  if (users.length <= 1) {
    res.status(400).json({ error: "Cannot remove the last administrator." });
    return;
  }
  if (req.params.id === res.locals.adminUser?.id) {
    res.status(400).json({ error: "You can't remove your own account." });
    return;
  }
  const remaining = users.filter((user) => user.id !== req.params.id);
  if (remaining.length === users.length) {
    res.status(404).json({ error: "Staff account not found." });
    return;
  }
  await writeUsers(remaining);
  res.status(204).end();
}
