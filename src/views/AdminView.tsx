import React, { useState, useMemo, useEffect } from "react";
import {
  PrayerRequest,
  VisitPlan,
  ContactMessage,
  ChurchEvent,
  EventRegistration,
  GivingRecord,
  StaffUser,
  StaffRole,
  PageId,
} from "../types";
import { exportToCSV } from "../utils/csvExport";
import { exportBannersJson } from "../utils/bannerManager";
import { exportContentJson } from "../utils/contentManager";
import { ICGCLogo } from "../components/ICGCLogo";
import { AdminBannerManager } from "../components/AdminBannerManager";
import { AdminContentManager } from "../components/AdminContentManager";
import {
  Users,
  Heart,
  Mail,
  Shield,
  Layers,
  Lock,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Ticket,
  DollarSign,
  Smartphone,
  Building2,
  FileSpreadsheet,
  HelpCircle,
  X,
  Phone,
  Calendar,
  AlertCircle,
  UserCheck,
  UserPlus,
  Key,
  LogOut,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  Trash2,
  Edit2,
  Edit3,
  FileText,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

interface AdminViewProps {
  initialTab?: string;
  prayerRequests: PrayerRequest[];
  visitPlans: VisitPlan[];
  contactMessages: ContactMessage[];
  givingRecords: GivingRecord[];
  eventRegistrations: EventRegistration[];
  events: ChurchEvent[];
  onUpdatePrayerStatus: (
    id: string,
    status: "new" | "prayed" | "archived",
  ) => void;
  onUpdateVisitStatus: (
    id: string,
    status: "planned" | "welcomed" | "followup-assigned",
  ) => void;
  onUpdateMessageStatus: (
    id: string,
    status: "unread" | "read" | "replied",
  ) => void;
  onUpdateGivingStatus: (
    id: string,
    status: "pending-verification" | "confirmed",
  ) => void;
  onNavigate: (page: PageId, subTab?: string) => void;
}

type AdminTab =
  | "giving"
  | "events"
  | "prayers"
  | "visits"
  | "messages"
  | "banners"
  | "content"
  | "staff";

const TAB_ACCESS: Record<AdminTab, StaffRole[]> = {
  giving: ["super-admin", "finance"],
  events: ["super-admin", "secretariat", "protocol"],
  prayers: ["super-admin", "pastoral"],
  visits: ["super-admin", "protocol", "secretariat"],
  messages: ["super-admin", "secretariat"],
  banners: ["super-admin"],
  content: ["super-admin"],
  staff: ["super-admin"],
};

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

// Initial authorized personnel roster
const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: "staff-1",
    name: "Rev. Gabriel Dela",
    email: "shepherd@wisdomtemple.org",
    role: "super-admin",
    roleLabel: "Senior Minister & Head Administrator",
    passcode: "7788",
    phone: "+233 24 500 9764",
    dateAdded: "Jan 1, 2026",
    isActive: true,
  },
  {
    id: "staff-2",
    name: "Church Secretariat Desk",
    email: "secretariat@wisdomtemple.org",
    role: "secretariat",
    roleLabel: "Secretariat & Correspondence",
    passcode: "1122",
    phone: "+233 24 000 1122",
    dateAdded: "Jan 10, 2026",
    isActive: true,
  },
  {
    id: "staff-3",
    name: "Treasury & Accounts Officer",
    email: "finance@wisdomtemple.org",
    role: "finance",
    roleLabel: "Treasury & MoMo Reconciliation",
    passcode: "4455",
    phone: "+233 20 888 4455",
    dateAdded: "Feb 1, 2026",
    isActive: true,
  },
  {
    id: "staff-4",
    name: "Pastoral Care & Prayer Lead",
    email: "prayer@wisdomtemple.org",
    role: "pastoral",
    roleLabel: "Intercession & Altar Team",
    passcode: "3344",
    phone: "+233 54 999 3344",
    dateAdded: "Feb 15, 2026",
    isActive: true,
  },
  {
    id: "staff-5",
    name: "Protocol & Guest Reception",
    email: "protocol@wisdomtemple.org",
    role: "protocol",
    roleLabel: "Protocol, Ushers & New Visitors",
    passcode: "5566",
    phone: "+233 27 777 5566",
    dateAdded: "Mar 1, 2026",
    isActive: true,
  },
];

export const AdminView: React.FC<AdminViewProps> = ({
  initialTab,
  prayerRequests: initialPrayerRequests,
  visitPlans: initialVisitPlans,
  contactMessages: initialContactMessages,
  givingRecords: initialGivingRecords,
  eventRegistrations: initialEventRegistrations,
  events,
  onUpdatePrayerStatus: parentUpdatePrayerStatus,
  onUpdateVisitStatus: parentUpdateVisitStatus,
  onUpdateMessageStatus: parentUpdateMessageStatus,
  onUpdateGivingStatus: parentUpdateGivingStatus,
  onNavigate,
}) => {
  // Staff Authentication State
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);

  const [currentStaff, setCurrentStaff] = useState<StaffUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [prayerRequests, setPrayerRequests] = useState(initialPrayerRequests);
  const [visitPlans, setVisitPlans] = useState(initialVisitPlans);
  const [contactMessages, setContactMessages] = useState(
    initialContactMessages,
  );
  const [givingRecords, setGivingRecords] = useState(initialGivingRecords);
  const [eventRegistrations, setEventRegistrations] = useState(
    initialEventRegistrations,
  );

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPasscode, setLoginPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Dashboard Navigation State
  const [activeTab, setActiveTabState] = useState<AdminTab>(() => {
    if (
      initialTab &&
      [
        "giving",
        "events",
        "prayers",
        "visits",
        "messages",
        "banners",
        "content",
        "staff",
      ].includes(initialTab)
    ) {
      return initialTab as any;
    }
    return "giving";
  });

  useEffect(() => {
    if (
      initialTab &&
      [
        "giving",
        "events",
        "prayers",
        "visits",
        "messages",
        "banners",
        "content",
        "staff",
      ].includes(initialTab)
    ) {
      setActiveTabState(initialTab as AdminTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (currentStaff && !canAccessTab(activeTab)) {
      const firstAllowedTab =
        (Object.keys(TAB_ACCESS) as AdminTab[]).find(canAccessTab) || "giving";
      setActiveTabState(firstAllowedTab);
    }
  }, [currentStaff, activeTab]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGuideModal, setShowGuideModal] = useState(false);

  // New Staff Modal State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>("secretariat");
  const [newStaffPasscode, setNewStaffPasscode] = useState("");
  const [revealedPasscodes, setRevealedPasscodes] = useState<
    Record<string, boolean>
  >({});

  const canAccessTab = (tab: AdminTab) =>
    Boolean(currentStaff && TAB_ACCESS[tab].includes(currentStaff.role));
  const setActiveTab = (tab: AdminTab) => {
    if (canAccessTab(tab)) setActiveTabState(tab);
  };

  // Validate the HttpOnly server session on every portal load.
  useEffect(() => {
    fetch("/api/admin/session")
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = await response.json();
        return payload.user as Omit<StaffUser, "passcode" | "dateAdded"> & {
          createdAt?: string;
        };
      })
      .then((user) => {
        if (user) {
          setCurrentStaff({
            ...user,
            passcode: "",
            dateAdded: user.createdAt || new Date().toLocaleDateString(),
          });
        }
      })
      .catch(() => undefined)
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (!currentStaff) return;

    fetch("/api/admin/records")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load protected records.");
        return response.json();
      })
      .then((records) => {
        setGivingRecords(records.givingRecords || []);
        setEventRegistrations(records.eventRegistrations || []);
        setPrayerRequests(records.prayerRequests || []);
        setVisitPlans(records.visitPlans || []);
        setContactMessages(records.contactMessages || []);
      })
      .catch(() => undefined);
  }, [currentStaff]);

  useEffect(() => {
    if (!currentStaff || currentStaff.role !== "super-admin") return;

    fetch("/api/admin/staff")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load staff directory.");
        return response.json();
      })
      .then((payload) => {
        setStaffUsers(
          (payload.users || []).map(
            (
              user: Omit<StaffUser, "passcode" | "dateAdded"> & {
                createdAt: string;
              },
            ) => ({
              ...user,
              passcode: "",
              dateAdded: new Date(user.createdAt).toLocaleDateString(),
            }),
          ),
        );
      })
      .catch(() => undefined);
  }, [currentStaff]);

  // Handle Login Authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const trimmedIdentifier = loginEmail.trim().toLowerCase();
    const trimmedPasscode = loginPasscode.trim();

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedIdentifier,
          password: trimmedPasscode,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setLoginError(payload.error || "Access denied.");
        return;
      }

      const user = payload.user as Omit<StaffUser, "passcode" | "dateAdded"> & {
        createdAt?: string;
      };
      setCurrentStaff({
        ...user,
        passcode: "",
        dateAdded: user.createdAt || new Date().toLocaleDateString(),
      });
      setLoginPasscode("");
      setLoginError("");
    } catch {
      setLoginError(
        "The secure admin service is unavailable. Please try again.",
      );
    }
  };

  // Handle Logout / Lock
  const handleLogout = () => {
    void fetch("/api/admin/logout", { method: "POST" });
    setCurrentStaff(null);
    setLoginPasscode("");
    setLoginError("");
  };

  const updateRecordStatus = async (
    collection: string,
    id: string,
    status: string,
  ) => {
    const response = await fetch(
      `/api/admin/records/${collection}/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );
    if (!response.ok) throw new Error("Could not update record status.");
  };

  const onUpdatePrayerStatus = async (
    id: string,
    status: "new" | "prayed" | "archived",
  ) => {
    await updateRecordStatus("prayerRequests", id, status);
    setPrayerRequests((records) =>
      records.map((record) =>
        record.id === id ? { ...record, status } : record,
      ),
    );
    parentUpdatePrayerStatus(id, status);
  };

  const onUpdateVisitStatus = async (
    id: string,
    status: "planned" | "welcomed" | "followup-assigned",
  ) => {
    await updateRecordStatus("visitPlans", id, status);
    setVisitPlans((records) =>
      records.map((record) =>
        record.id === id ? { ...record, status } : record,
      ),
    );
    parentUpdateVisitStatus(id, status);
  };

  const onUpdateMessageStatus = async (
    id: string,
    status: "unread" | "read" | "replied",
  ) => {
    await updateRecordStatus("contactMessages", id, status);
    setContactMessages((records) =>
      records.map((record) =>
        record.id === id ? { ...record, status } : record,
      ),
    );
    parentUpdateMessageStatus(id, status);
  };

  const onUpdateGivingStatus = async (
    id: string,
    status: "pending-verification" | "confirmed",
  ) => {
    await updateRecordStatus("givingRecords", id, status);
    setGivingRecords((records) =>
      records.map((record) =>
        record.id === id ? { ...record, status } : record,
      ),
    );
    parentUpdateGivingStatus(id, status);
  };

  useEffect(() => {
    if (!currentStaff) return;
    const timeoutId = window.setTimeout(handleLogout, SESSION_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [currentStaff]);

  // Handle Add New Staff
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newStaffName.trim() ||
      !newStaffEmail.trim() ||
      !newStaffPasscode.trim()
    )
      return;

    const response = await fetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newStaffName,
        email: newStaffEmail,
        phone: newStaffPhone,
        role: newStaffRole,
        password: newStaffPasscode,
      }),
    });
    if (!response.ok) return;
    const { user } = await response.json();
    setStaffUsers((prev) => [
      ...prev,
      {
        ...user,
        passcode: "",
        dateAdded: new Date(user.createdAt).toLocaleDateString(),
      },
    ]);
    setShowAddStaffModal(false);
    setNewStaffName("");
    setNewStaffEmail("");
    setNewStaffPhone("");
    setNewStaffPasscode("");
  };

  // Handle Toggle Active
  const handleToggleStaffActive = async (staffId: string) => {
    const staff = staffUsers.find((user) => user.id === staffId);
    if (!staff) return;
    const response = await fetch(
      `/api/admin/staff/${encodeURIComponent(staffId)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !staff.isActive }),
      },
    );
    if (response.ok)
      setStaffUsers((prev) =>
        prev.map((user) =>
          user.id === staffId ? { ...user, isActive: !user.isActive } : user,
        ),
      );
  };

  // Handle Remove Staff
  const handleRemoveStaff = async (staffId: string) => {
    if (staffUsers.length <= 1) {
      alert("Cannot delete the last remaining administrator.");
      return;
    }
    if (
      confirm(
        "Are you sure you want to revoke this staff member's access to the Church Admin Portal?",
      )
    ) {
      const response = await fetch(
        `/api/admin/staff/${encodeURIComponent(staffId)}`,
        { method: "DELETE" },
      );
      if (response.ok)
        setStaffUsers((prev) => prev.filter((u) => u.id !== staffId));
    }
  };

  // Toggle Reveal Passcode
  const toggleRevealPasscode = (staffId: string) => {
    setRevealedPasscodes((prev) => ({
      ...prev,
      [staffId]: !prev[staffId],
    }));
  };

  // Filter records based on search query
  const filteredGiving = useMemo(() => {
    if (!searchQuery.trim()) return givingRecords;
    const q = searchQuery.toLowerCase();
    return givingRecords.filter(
      (g) =>
        g.donorName.toLowerCase().includes(q) ||
        g.referenceCode.toLowerCase().includes(q) ||
        g.phoneOrTxnId.toLowerCase().includes(q) ||
        g.fund.toLowerCase().includes(q),
    );
  }, [givingRecords, searchQuery]);

  const filteredRegistrations = useMemo(() => {
    if (!searchQuery.trim()) return eventRegistrations;
    const q = searchQuery.toLowerCase();
    return eventRegistrations.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.eventName.toLowerCase().includes(q) ||
        r.registrationCode.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q),
    );
  }, [eventRegistrations, searchQuery]);

  const filteredPrayers = useMemo(() => {
    if (!searchQuery.trim()) return prayerRequests;
    const q = searchQuery.toLowerCase();
    return prayerRequests.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.requestText.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q),
    );
  }, [prayerRequests, searchQuery]);

  const filteredVisits = useMemo(() => {
    if (!searchQuery.trim()) return visitPlans;
    const q = searchQuery.toLowerCase();
    return visitPlans.filter(
      (v) =>
        v.fullName.toLowerCase().includes(q) ||
        v.phone.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q),
    );
  }, [visitPlans, searchQuery]);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return contactMessages;
    const q = searchQuery.toLowerCase();
    return contactMessages.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q),
    );
  }, [contactMessages, searchQuery]);

  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return staffUsers;
    const q = searchQuery.toLowerCase();
    return staffUsers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.roleLabel.toLowerCase().includes(q),
    );
  }, [staffUsers, searchQuery]);

  // Handle CSV Export for Active Tab
  const handleExportTab = () => {
    switch (activeTab) {
      case "giving":
        exportToCSV(givingRecords, "Wisdom_Temple_Giving_Records");
        break;
      case "events":
        exportToCSV(eventRegistrations, "Wisdom_Temple_Event_Registrations");
        break;
      case "prayers":
        exportToCSV(prayerRequests, "Wisdom_Temple_Prayer_Petitions");
        break;
      case "visits":
        exportToCSV(visitPlans, "Wisdom_Temple_Visitor_Connect_Plans");
        break;
      case "messages":
        exportToCSV(contactMessages, "Wisdom_Temple_Contact_Inquiries");
        break;
      case "staff":
        exportToCSV(
          staffUsers.map((s) => ({
            Name: s.name,
            Email: s.email,
            Role: s.roleLabel,
            Phone: s.phone || "N/A",
            DateAdded: s.dateAdded,
            Status: s.isActive ? "Active" : "Suspended",
          })),
          "Wisdom_Temple_Authorized_Staff",
        );
        break;
      case "banners": {
        const data = exportBannersJson();
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Wisdom_Temple_Banners_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        break;
      }
      case "content": {
        exportContentJson();
        break;
      }
      default:
        break;
    }
  };

  // =========================================================================
  // IF NOT AUTHENTICATED: RENDER SECURE STAFF LOGIN GATE
  // =========================================================================
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center text-gold-300 text-xs font-mono uppercase tracking-[0.18em]">
        Verifying secure session...
      </div>
    );
  }

  if (!currentStaff) {
    return (
      <div className="min-h-screen bg-forest-950 flex flex-col selection:bg-gold-500 selection:text-forest-950">
        {/* Standalone Admin Header Bar */}
        <header className="w-full bg-forest-950 border-b border-forest-700 text-white py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ICGCLogo
                size="sm"
                variant="horizontal"
                theme="dark"
                forceWhite={true}
              />
              <span className="hidden sm:inline-block h-4 w-px bg-forest-700" />
              <span className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-forest-850 text-gold-300 text-[10px] font-mono font-bold tracking-wider border border-gold-500/30">
                <Lock className="w-3 h-3 text-gold-500" />
                <span>CHURCH ADMINISTRATION PORTAL</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="px-3.5 py-1.5 rounded-xl bg-forest-850 hover:bg-forest-800 text-emerald-200 hover:text-white border border-forest-700 text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180 text-gold-500" />
              <span>Return to Church Website</span>
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Header & Crest */}
            <div className="text-center space-y-3 mb-8">
              <div className="inline-block p-3 rounded-2xl bg-forest-900 border border-gold-500/40 shadow-xl">
                <ICGCLogo
                  size="md"
                  variant="horizontal"
                  theme="dark"
                  forceWhite={true}
                />
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-forest-800 text-gold-300 text-[10px] font-mono font-bold tracking-widest uppercase border border-gold-500/40">
                  <Lock className="w-3 h-3 text-gold-500" />
                  <span>RESTRICTED ACCESS • AUTHORIZED PERSONNEL ONLY</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-title">
                Church Administration Gate
              </h1>
              <p className="text-xs text-emerald-200/80 max-w-sm mx-auto leading-relaxed">
                This portal is strictly reserved for the Senior Pastor,
                secretariat, and officially appointed church administrators.
                Regular members and visitors cannot access this section.
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-forest-900 rounded-3xl p-7 sm:p-9 border border-forest-600 shadow-2xl space-y-6">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start space-x-2 animate-in fade-in duration-200">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-emerald-200 mb-1.5">
                    Staff Email or Assigned Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. shepherd@wisdomtemple.org"
                      className="w-full px-4 py-3 bg-forest-950 border border-forest-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder-emerald-400/40"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-mono font-semibold uppercase text-emerald-200">
                      Security Passcode or PIN
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-gold-300 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      <span>{showPassword ? "Hide" : "Reveal"}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPasscode}
                      onChange={(e) => setLoginPasscode(e.target.value)}
                      placeholder="Enter security PIN"
                      className="w-full px-4 py-3 bg-forest-950 border border-forest-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder-emerald-400/40 font-mono tracking-wider"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Key className="w-4 h-4" />
                    <span>Authenticate & Enter Portal</span>
                  </button>
                </div>
              </form>

              {/* Back to Public Site */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate("home")}
                  className="text-xs text-emerald-400 hover:text-white flex items-center justify-center space-x-1 mx-auto cursor-pointer transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180 text-gold-500" />
                  <span>Return to Public Website</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED: RENDER FULL ADMIN DASHBOARD WITH STAFF MANAGEMENT
  // =========================================================================
  return (
    <div className="bg-mist-50 min-h-screen text-slate-900 pb-24">
      {/* Standalone Admin Top Navigation Bar */}
      <header className="bg-forest-950 border-b border-forest-700 text-white py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ICGCLogo
              size="sm"
              variant="horizontal"
              theme="dark"
              forceWhite={true}
            />
            <span className="hidden sm:inline-block h-4 w-px bg-forest-700" />
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-forest-850 text-gold-300 text-[10px] font-mono font-bold tracking-wider border border-gold-500/30">
              <Lock className="w-3 h-3 text-gold-500" />
              <span>CHURCH ADMINISTRATION PORTAL</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="px-3.5 py-1.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-emerald-200 hover:text-white border border-forest-700 text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180 text-gold-500" />
              <span>Return to Church Website</span>
            </button>
          </div>
        </div>
      </header>

      {/* Top Staff Navigation Header */}
      <section className="bg-forest-950 text-white py-8 sm:py-10 border-b border-forest-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-gold-300 font-mono text-xs font-bold uppercase mb-1">
                <Shield className="w-4 h-4 text-gold-500" />
                <span>ECCLESIASTICAL LEADERSHIP & DISPATCH</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-title">
                Wisdom Temple Church Administration
              </h1>
              <p className="text-xs text-emerald-200/80 mt-1 max-w-2xl">
                Restricted portal for church records, treasury reconciliation,
                event passes, pastoral intercession petitions, and authorized
                staff management.
              </p>
            </div>

            {/* Current Staff Officer Badge & Quick Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="bg-forest-850 border border-forest-700 rounded-2xl px-3.5 py-2 flex items-center space-x-2 text-xs">
                <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-300">
                  <UserCheck className="w-4 h-4 text-gold-500" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 block font-mono">
                    AUTHENTICATED OFFICER
                  </span>
                  <strong className="text-white text-xs block leading-tight">
                    {currentStaff.name}
                  </strong>
                  <span className="text-[10px] text-gold-300 font-mono">
                    ({currentStaff.roleLabel})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGuideModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-forest-850 hover:bg-forest-800 text-emerald-200 hover:text-white border border-forest-700 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-gold-300" />
                <span className="hidden sm:inline">Guide</span>
              </button>

              <button
                type="button"
                onClick={handleExportTab}
                className="px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export to CSV</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                title="Lock session and sign out"
              >
                <LogOut className="w-4 h-4 text-red-300" />
                <span>Lock Portal</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="px-3.5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-850 text-emerald-300 hover:text-white border border-forest-700 text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>Public Site</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold-500" />
              </button>
            </div>
          </div>

          {/* Command Deck & Quick Access Modules */}
          <div className="mt-8 space-y-4">
            {/* Top Spotlight Cards: Content Writings & Banners Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Card 1: Site Writings & Copy */}
              <div
                onClick={() => setActiveTab("content")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden ${
                  activeTab === "content"
                    ? "bg-forest-800 border-gold-500 shadow-lg ring-2 ring-gold-500/40"
                    : "bg-forest-900 border-forest-700 hover:border-gold-500/60 hover:bg-forest-850"
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Edit3 className="w-6 h-6 text-gold-300" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white font-serif-title">
                        Site Writings & Page Copy
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500 text-forest-950 font-mono">
                        50+ Fields
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      Edit all headlines, pastoral themes, bio, mission, service
                      times & MoMo accounts
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center text-xs font-bold text-gold-300 group-hover:translate-x-1 transition-transform">
                  <span>Open Editor</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Card 2: Banners & Visual Media */}
              <div
                onClick={() => setActiveTab("banners")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden ${
                  activeTab === "banners"
                    ? "bg-forest-800 border-gold-500 shadow-lg ring-2 ring-gold-500/40"
                    : "bg-forest-900 border-forest-700 hover:border-gold-500/60 hover:bg-forest-850"
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-6 h-6 text-gold-300" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white font-serif-title">
                        Banners & Card Media
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500 text-forest-950 font-mono">
                        22 Slots
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      Upload & replace hero background, flyers, ministries &
                      page header graphics
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center text-xs font-bold text-gold-300 group-hover:translate-x-1 transition-transform">
                  <span>Open Media</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>

            {/* Department Quick Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div
                onClick={() => setActiveTab("giving")}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "giving"
                    ? "bg-forest-800 border-gold-500"
                    : "bg-forest-850 border-forest-700 hover:border-gold-500/40"
                }`}
              >
                <span className="text-[11px] text-emerald-300 font-mono block">
                  💰 Giving Logs
                </span>
                <strong className="text-lg sm:text-xl font-bold text-gold-300 font-mono">
                  {givingRecords.length}
                </strong>
              </div>

              <div
                onClick={() => setActiveTab("events")}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "events"
                    ? "bg-forest-800 border-gold-500"
                    : "bg-forest-850 border-forest-700 hover:border-gold-500/40"
                }`}
              >
                <span className="text-[11px] text-emerald-300 font-mono block">
                  🎟️ Event Passes
                </span>
                <strong className="text-lg sm:text-xl font-bold text-gold-300 font-mono">
                  {eventRegistrations.length}
                </strong>
              </div>

              <div
                onClick={() => setActiveTab("prayers")}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "prayers"
                    ? "bg-forest-800 border-gold-500"
                    : "bg-forest-850 border-forest-700 hover:border-gold-500/40"
                }`}
              >
                <span className="text-[11px] text-emerald-300 font-mono block">
                  🙏 Prayer Altar
                </span>
                <strong className="text-lg sm:text-xl font-bold text-gold-300 font-mono">
                  {prayerRequests.length}
                </strong>
              </div>

              <div
                onClick={() => setActiveTab("visits")}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "visits"
                    ? "bg-forest-800 border-gold-500"
                    : "bg-forest-850 border-forest-700 hover:border-gold-500/40"
                }`}
              >
                <span className="text-[11px] text-emerald-300 font-mono block">
                  👥 Guest Visits
                </span>
                <strong className="text-lg sm:text-xl font-bold text-gold-300 font-mono">
                  {visitPlans.length}
                </strong>
              </div>

              <div
                onClick={() => setActiveTab("messages")}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "messages"
                    ? "bg-forest-800 border-gold-500"
                    : "bg-forest-850 border-forest-700 hover:border-gold-500/40"
                }`}
              >
                <span className="text-[11px] text-emerald-300 font-mono block">
                  ✉️ Inquiries
                </span>
                <strong className="text-lg sm:text-xl font-bold text-gold-300 font-mono">
                  {contactMessages.length}
                </strong>
              </div>

              <div
                onClick={() => setActiveTab("staff")}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "staff"
                    ? "bg-forest-800 border-gold-500"
                    : "bg-forest-850 border-forest-700 hover:border-gold-500/40"
                }`}
              >
                <span className="text-[11px] text-emerald-300 font-mono block">
                  🛡️ Staff Access
                </span>
                <strong className="text-lg sm:text-xl font-bold text-gold-300 font-mono">
                  {staffUsers.length}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation & Search Bar */}
      <div className="bg-white border-b border-mist-300 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 py-3">
            {/* Mobile / Compact Dropdown Selector */}
            <div className="lg:hidden flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">
                Tab:
              </span>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-forest-900 focus:ring-2 focus:ring-gold-500"
              >
                <option value="content">
                  📝 Site Writings & Page Copy (50+ Fields)
                </option>
                <option value="banners">
                  🖼️ Banners & Card Media (22 Slots)
                </option>
                <option value="giving">
                  💰 Giving & MoMo Reconciliation ({givingRecords.length})
                </option>
                <option value="events">
                  🎟️ Event Passes & RSVPs ({eventRegistrations.length})
                </option>
                <option value="prayers">
                  🙏 Prayer Altar Petitions ({prayerRequests.length})
                </option>
                <option value="visits">
                  👥 Guest Visits & Welcomes ({visitPlans.length})
                </option>
                <option value="messages">
                  ✉️ Contact Inquiries ({contactMessages.length})
                </option>
                <option value="staff">
                  🛡️ Staff & Security PINs ({staffUsers.length})
                </option>
              </select>
            </div>

            {/* Desktop Full Tab Bar */}
            <div className="hidden lg:flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <button
                onClick={() => setActiveTab("content")}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === "content"
                    ? "bg-forest-900 text-gold-300 shadow-sm ring-1 ring-gold-500"
                    : "text-slate-700 hover:bg-mist-100 hover:text-forest-900"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-gold-500" />
                <span>Writings & Copy</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-gold-500 text-forest-950 text-[10px]">
                  50+
                </span>
              </button>

              <button
                onClick={() => setActiveTab("banners")}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === "banners"
                    ? "bg-forest-900 text-gold-300 shadow-sm ring-1 ring-gold-500"
                    : "text-slate-700 hover:bg-mist-100 hover:text-forest-900"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-gold-500" />
                <span>Banners & Media</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-gold-500 text-forest-950 text-[10px]">
                  22
                </span>
              </button>

              <span className="h-4 w-px bg-slate-200 mx-1" />

              <button
                onClick={() => setActiveTab("giving")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === "giving"
                    ? "bg-forest-900 text-gold-300 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Giving & MoMo ({givingRecords.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("events")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === "events"
                    ? "bg-forest-900 text-gold-300 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Events ({eventRegistrations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("prayers")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === "prayers"
                    ? "bg-forest-900 text-gold-300 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Prayer Altar ({prayerRequests.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("visits")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === "visits"
                    ? "bg-forest-900 text-gold-300 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Visits ({visitPlans.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("messages")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === "messages"
                    ? "bg-forest-900 text-gold-300 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Inquiries ({contactMessages.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("staff")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === "staff"
                    ? "bg-forest-900 text-gold-300 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Staff ({staffUsers.length})</span>
              </button>
            </div>

            {/* Live Search Bar */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, code..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* =========================================================================
            TAB 1: GIVING & MOMO RECONCILIATION
            ========================================================================= */}
        {activeTab === "giving" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-mist-300 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-forest-900 font-serif-title flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-gold-500" />
                  <span>Treasury & Giving Reconciliation Logs</span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Submissions from the digital giving portal with reference
                  codes for cross-referencing against MTN MoMo / Bank
                  statements.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  exportToCSV(givingRecords, "Wisdom_Temple_Giving_Records")
                }
                className="px-3.5 py-2 bg-mist-100 hover:bg-mist-200 text-forest-700 border border-mist-400 text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 text-gold-500" />
                <span>Export Giving (.CSV)</span>
              </button>
            </div>

            {filteredGiving.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-mist-300 text-slate-500 text-xs">
                No giving records found matching your search.
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-mist-300 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-mist-50 border-b border-mist-300 text-slate-600 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Donor Name</th>
                        <th className="py-3 px-4">Fund / Purpose</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Method & Phone / Txn</th>
                        <th className="py-3 px-4">Audit Reference</th>
                        <th className="py-3 px-4">Reconciliation</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-mist-100">
                      {filteredGiving.map((record) => (
                        <tr
                          key={record.id}
                          className="hover:bg-mist-50 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                            {record.dateSubmitted}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {record.donorName}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-gold-50 text-forest-700 border border-gold-500/40 font-semibold text-[11px]">
                              {record.fund}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-900 text-sm">
                            {record.currency} {record.amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800">
                              {record.paymentMethod}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {record.phoneOrTxnId}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-gold-500">
                            {record.referenceCode}
                          </td>
                          <td className="py-3.5 px-4">
                            {record.status === "confirmed" ? (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Reconciled</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>Pending Match</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateGivingStatus(
                                  record.id,
                                  record.status === "confirmed"
                                    ? "pending-verification"
                                    : "confirmed",
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
                            >
                              {record.status === "confirmed"
                                ? "Mark Pending"
                                : "Mark Reconciled"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: EVENT PASSES & SUMMIT REGISTRATIONS
            ========================================================================= */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-mist-300 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-forest-900 font-serif-title flex items-center space-x-2">
                  <Ticket className="w-5 h-5 text-gold-500" />
                  <span>Wisdom Summit & Church Event Passes</span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Digital reservation list of registered attendees and issued
                  pass codes.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  exportToCSV(
                    eventRegistrations,
                    "Wisdom_Temple_Event_Registrations",
                  )
                }
                className="px-3.5 py-2 bg-mist-100 hover:bg-mist-200 text-forest-700 border border-mist-400 text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 text-gold-500" />
                <span>Export Passes (.CSV)</span>
              </button>
            </div>

            {filteredRegistrations.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-mist-300 text-slate-500 text-xs">
                No event registrations found.
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-mist-300 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-mist-50 border-b border-mist-300 text-slate-600 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Date Registered</th>
                        <th className="py-3 px-4">Event Name</th>
                        <th className="py-3 px-4">Attendee Name</th>
                        <th className="py-3 px-4">Contact Phone</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Seats Reserved</th>
                        <th className="py-3 px-4">Pass Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-mist-100">
                      {filteredRegistrations.map((reg) => (
                        <tr
                          key={reg.id}
                          className="hover:bg-mist-50 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                            {reg.dateRegistered}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-forest-900">
                            {reg.eventName}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {reg.fullName}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-700">
                            {reg.phone}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {reg.email || "—"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono font-bold text-[11px]">
                              {reg.attendeesCount} seat(s)
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-forest-700 bg-mist-100/60">
                            {reg.registrationCode}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: PRAYER ALTAR PETITIONS
            ========================================================================= */}
        {activeTab === "prayers" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-mist-300 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-forest-900 font-serif-title flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-gold-500" />
                  <span>Confidential Prayer Requests & Intercession</span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Member and visitor petitions placed upon the altar for
                  pastoral and intercession team prayer.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  exportToCSV(prayerRequests, "Wisdom_Temple_Prayer_Petitions")
                }
                className="px-3.5 py-2 bg-mist-100 hover:bg-mist-200 text-forest-700 border border-mist-400 text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 text-gold-500" />
                <span>Export Prayers (.CSV)</span>
              </button>
            </div>

            {filteredPrayers.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-mist-300 text-slate-500 text-xs">
                No prayer petitions found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPrayers.map((prayer) => (
                  <div
                    key={prayer.id}
                    className="bg-white rounded-3xl p-5 border border-mist-300 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <strong className="text-sm text-forest-900 font-bold">
                            {prayer.fullName}
                          </strong>
                          {prayer.isConfidential && (
                            <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-bold rounded-full border border-red-200">
                              Confidential
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                          {prayer.dateSubmitted} • Category:{" "}
                          <strong className="text-forest-700">
                            {prayer.category}
                          </strong>
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          prayer.status === "prayed"
                            ? "bg-emerald-100 text-emerald-800"
                            : prayer.status === "new"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {prayer.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="p-3.5 bg-mist-50 rounded-2xl border border-mist-100 text-xs text-slate-800 leading-relaxed italic">
                      "{prayer.requestText}"
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <div className="text-slate-500 font-mono">
                        Phone: {prayer.phone || "N/A"}{" "}
                        {prayer.wantsFollowup && "• (Wants Call)"}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdatePrayerStatus(
                              prayer.id,
                              prayer.status === "prayed" ? "new" : "prayed",
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-mist-100 hover:bg-mist-200 text-forest-700 font-bold transition-colors cursor-pointer"
                        >
                          {prayer.status === "prayed"
                            ? "Mark New"
                            : "Mark Prayed"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: GUEST VISITS & HOSTING
            ========================================================================= */}
        {activeTab === "visits" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-mist-300 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-forest-900 font-serif-title flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gold-500" />
                  <span>First-Time Guest Connect Plans</span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Submissions from the "I'm New Here" plan-a-visit portal for
                  protocol and ushering teams.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  exportToCSV(visitPlans, "Wisdom_Temple_Visitor_Connect_Plans")
                }
                className="px-3.5 py-2 bg-mist-100 hover:bg-mist-200 text-forest-700 border border-mist-400 text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 text-gold-500" />
                <span>Export Visitors (.CSV)</span>
              </button>
            </div>

            {filteredVisits.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-mist-300 text-slate-500 text-xs">
                No visitor connect cards found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="bg-white rounded-3xl p-5 border border-mist-300 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <strong className="text-sm text-forest-900 font-bold block">
                          {visit.fullName}
                        </strong>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Visiting: {visit.serviceDate} ({visit.serviceTime})
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                        {visit.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">
                          Party Size
                        </span>
                        <strong className="text-slate-800">
                          {visit.adultsCount} Adults, {visit.childrenCount} Kids
                        </strong>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">
                          Phone
                        </span>
                        <strong className="text-slate-800 font-mono">
                          {visit.phone}
                        </strong>
                      </div>
                    </div>

                    {visit.specialNeeds && (
                      <div className="text-[11px] text-slate-600 bg-gold-50 p-2.5 rounded-xl border border-gold-500/30">
                        <strong>Notes:</strong> {visit.specialNeeds}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400 font-mono">
                        Submitted: {visit.dateSubmitted}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateVisitStatus(
                            visit.id,
                            visit.status === "welcomed"
                              ? "planned"
                              : "welcomed",
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-mist-100 hover:bg-mist-200 text-forest-700 font-bold transition-colors cursor-pointer"
                      >
                        {visit.status === "welcomed"
                          ? "Mark Planned"
                          : "Mark Welcomed"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: INQUIRIES & MESSAGES
            ========================================================================= */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-mist-300 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-forest-900 font-serif-title flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-gold-500" />
                  <span>General Church Inquiries & Messages</span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Secretariat correspondence received via the website contact
                  form.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  exportToCSV(
                    contactMessages,
                    "Wisdom_Temple_Contact_Inquiries",
                  )
                }
                className="px-3.5 py-2 bg-mist-100 hover:bg-mist-200 text-forest-700 border border-mist-400 text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4 text-gold-500" />
                <span>Export Messages (.CSV)</span>
              </button>
            </div>

            {filteredMessages.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-mist-300 text-slate-500 text-xs">
                No contact messages found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white rounded-3xl p-5 border border-mist-300 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <strong className="text-sm text-forest-900 font-bold block">
                          {msg.fullName}
                        </strong>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {msg.email} • {msg.phone}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          msg.status === "replied"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {msg.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-forest-700">
                      Subject: {msg.subject}
                    </div>

                    <div className="p-3 bg-mist-50 rounded-2xl border border-mist-100 text-xs text-slate-700 leading-relaxed">
                      "{msg.message}"
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-400 font-mono">
                        {msg.dateSubmitted}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateMessageStatus(
                            msg.id,
                            msg.status === "replied" ? "unread" : "replied",
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                      >
                        {msg.status === "replied"
                          ? "Mark Unread"
                          : "Mark Replied"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 6: STAFF & DELEGATED ACCESS CONTROL ("ANYONE THEY PUT IN CHARGE")
            ========================================================================= */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-mist-300 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center space-x-2 text-forest-700 font-mono text-xs font-bold uppercase mb-1">
                  <Shield className="w-4 h-4 text-gold-500" />
                  <span>ECCLESIASTICAL ACCESS CONTROL & DELEGATION</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-forest-900 font-serif-title">
                  Authorized Church Staff & Leadership
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Only individuals appointed by church leadership are permitted
                  into this portal. The Head Administrator can delegate access,
                  appoint department leads (Treasury, Secretariat, Intercession,
                  Protocol), and assign security PINs below.
                </p>
              </div>

              <div className="flex items-center space-x-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-4 py-2.5 bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all cursor-pointer border border-gold-500/40"
                >
                  <UserPlus className="w-4 h-4 text-gold-300" />
                  <span>Appoint New Staff Officer</span>
                </button>
              </div>
            </div>

            {/* Roster of Authorized Staff */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className={`bg-white rounded-3xl p-5 border transition-all shadow-sm space-y-4 relative ${
                    staff.isActive
                      ? "border-mist-300"
                      : "border-red-200 bg-red-50/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <strong className="text-base font-bold text-forest-900 block">
                        {staff.name}
                      </strong>
                      <span className="text-xs text-forest-700 font-semibold block">
                        {staff.roleLabel}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                        {staff.email}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        staff.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {staff.isActive ? "ACTIVE" : "SUSPENDED"}
                    </span>
                  </div>

                  <div className="p-3 bg-mist-50 rounded-2xl border border-mist-100 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-500 font-mono">
                        Password storage:
                      </span>
                      <div className="flex items-center space-x-1.5 font-mono">
                        <span className="font-bold text-forest-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          Hashed on server
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>Phone:</span>
                      <span className="font-mono text-slate-700">
                        {staff.phone || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>Date Appointed:</span>
                      <span className="font-mono text-slate-700">
                        {staff.dateAdded}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggleStaffActive(staff.id)}
                      className={`font-semibold cursor-pointer text-[11px] transition-colors ${
                        staff.isActive
                          ? "text-amber-700 hover:text-amber-900"
                          : "text-emerald-700 hover:text-emerald-900"
                      }`}
                    >
                      {staff.isActive ? "Suspend Access" : "Reactivate Access"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveStaff(staff.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer text-[11px] flex items-center space-x-1 transition-colors"
                      title="Revoke access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Revoke</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Role Permissions Reference Card */}
            <div className="bg-forest-900 rounded-3xl p-6 text-white border border-forest-600 space-y-4">
              <div className="flex items-center space-x-2 text-gold-300 text-xs font-mono font-bold uppercase">
                <Shield className="w-4 h-4 text-gold-500" />
                <span>ROLE DELEGATION & PERMISSIONS HIERARCHY</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-forest-850 border border-forest-700">
                  <strong className="text-gold-300 block font-mono">
                    1. Head Administrator (Senior Pastor)
                  </strong>
                  <p className="text-[11px] text-emerald-200/80 mt-1 leading-relaxed">
                    Full ecclesiastical authority: manage staff, export all
                    church records, oversee treasury, alter altar prayer
                    petitions.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-forest-850 border border-forest-700">
                  <strong className="text-gold-300 block font-mono">
                    2. Treasury & Accounts (Finance Officer)
                  </strong>
                  <p className="text-[11px] text-emerald-200/80 mt-1 leading-relaxed">
                    Reconciles FirstFruit seeds, tithes, and offerings against
                    MTN Mobile Money and CBG bank statements.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-forest-850 border border-forest-700">
                  <strong className="text-gold-300 block font-mono">
                    3. Pastoral Intercession (Prayer Lead)
                  </strong>
                  <p className="text-[11px] text-emerald-200/80 mt-1 leading-relaxed">
                    Access to altar petitions and confidential prayer requests
                    for pastoral care and intercession nights.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-forest-850 border border-forest-700">
                  <strong className="text-gold-300 block font-mono">
                    4. Secretariat & Front Desk
                  </strong>
                  <p className="text-[11px] text-emerald-200/80 mt-1 leading-relaxed">
                    Monitors website inquiries, Wisdom Summit event
                    reservations, and general church correspondence.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-forest-850 border border-forest-700">
                  <strong className="text-gold-300 block font-mono">
                    5. Protocol & Ushers Directorate
                  </strong>
                  <p className="text-[11px] text-emerald-200/80 mt-1 leading-relaxed">
                    Manages "I'm New Here" guest visit plans, seating
                    preparations, and special accommodations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: BANNERS & CARD MEDIA MANAGER
            ========================================================================= */}
        {activeTab === "banners" && (
          <AdminBannerManager onNavigate={onNavigate} />
        )}

        {/* =========================================================================
            TAB 8: SITE WRITINGS & COPY MANAGER
            ========================================================================= */}
        {activeTab === "content" && (
          <AdminContentManager onNavigate={onNavigate} />
        )}
      </div>

      {/* =========================================================================
          MODAL: APPOINT NEW AUTHORIZED STAFF
          ========================================================================= */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-mist-300 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-mist-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-forest-900 text-gold-300 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-forest-900 font-serif-title">
                    Appoint Authorized Staff
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Grant administrative portal access
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block text-forest-900 font-semibold uppercase mb-1">
                  Full Name & Title *
                </label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Deacon Kwame Osei"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-forest-900 font-semibold uppercase mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="k.osei@wisdomtemple.org"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-forest-900 font-semibold uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    placeholder="+233 24 000 0000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-forest-900 font-semibold uppercase mb-1">
                    Assigned Role *
                  </label>
                  <select
                    value={newStaffRole}
                    onChange={(e) =>
                      setNewStaffRole(e.target.value as StaffRole)
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="super-admin">
                      Head Administrator (Full Access)
                    </option>
                    <option value="finance">Treasury & Accounts Officer</option>
                    <option value="secretariat">
                      Secretariat & Correspondence
                    </option>
                    <option value="pastoral">
                      Pastoral Care & Prayer Lead
                    </option>
                    <option value="protocol">Protocol & Guest Reception</option>
                  </select>
                </div>
                <div>
                  <label className="block text-forest-900 font-semibold uppercase mb-1">
                    Security PIN / Passcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaffPasscode}
                    onChange={(e) => setNewStaffPasscode(e.target.value)}
                    placeholder="e.g. 8899 or SecretPIN"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold transition-all shadow-md cursor-pointer border border-gold-500/40"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: GUIDE FOR DATA EXTRACTION
          ========================================================================= */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-mist-300 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-mist-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-forest-900 text-gold-300 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-forest-900 font-serif-title">
                  Staff Portal & Access Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-forest-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-forest-900 block">
                    Restricted Access Control:
                  </strong>
                  <span>
                    This portal is completely hidden from regular members. Only
                    appointed staff with recognized credentials and security
                    PINs can unlock it.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-forest-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-forest-900 block">
                    Delegating Access ("Anyone Put in Charge"):
                  </strong>
                  <span>
                    Under the <strong>Staff & Access Control</strong> tab, the
                    Head Administrator can appoint new officers (e.g. Treasury
                    Officer, Intercession Lead, Secretariat) and assign
                    customized PINs.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-forest-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-forest-900 block">
                    1-Click CSV / Excel Export:
                  </strong>
                  <span>
                    Click <strong>"Export to CSV"</strong> on any tab to
                    download an offline spreadsheet for Microsoft Excel or
                    Google Sheets.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-forest-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  4
                </span>
                <div>
                  <strong className="text-forest-900 block">
                    Locking the Portal:
                  </strong>
                  <span>
                    When you finish your administrative duties, click{" "}
                    <strong>"Lock Portal"</strong> at the top right to
                    immediately lock the session.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-full py-3 bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
              >
                Understood, Return to Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
