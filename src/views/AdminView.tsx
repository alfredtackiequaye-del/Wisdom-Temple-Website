import React, { useState } from 'react';
import { PrayerRequest, VisitPlan, ContactMessage, ChurchEvent, PageId } from '../types';
import { 
  Users, 
  Heart, 
  Mail, 
  Shield, 
  Layers, 
  Lock
} from 'lucide-react';

interface AdminViewProps {
  prayerRequests: PrayerRequest[];
  visitPlans: VisitPlan[];
  contactMessages: ContactMessage[];
  events: ChurchEvent[];
  onUpdatePrayerStatus: (id: string, status: 'new' | 'prayed' | 'archived') => void;
  onUpdateVisitStatus: (id: string, status: 'planned' | 'welcomed' | 'followup-assigned') => void;
  onUpdateMessageStatus: (id: string, status: 'unread' | 'read' | 'replied') => void;
  onNavigate: (page: PageId) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  prayerRequests,
  visitPlans,
  contactMessages,
  events,
  onUpdatePrayerStatus,
  onUpdateVisitStatus,
  onUpdateMessageStatus,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'prayers' | 'visits' | 'messages' | 'placeholders'>('prayers');

  return (
    <div className="bg-[#f8faf8] min-h-screen text-slate-900 pb-24">
      {/* Header - ICGC Forest & Gold */}
      <section className="bg-[#02180e] text-white py-12 border-b border-[#084c2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-[#f5cf72] font-mono text-xs font-bold uppercase mb-1">
                <Shield className="w-4 h-4 text-[#c99726]" />
                <span>ECCLESIASTICAL PORTAL & DISPATCH</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white font-serif-title">
                Wisdom Temple Administration
              </h1>
              <p className="text-xs text-emerald-200/80 mt-1">
                Live dashboard for pastoral care, visitor reception, prayer intercession, and content governance.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-[#042819] border border-[#c99726]/40 text-[#f5cf72] text-xs font-mono font-bold rounded-full">
                ● Live Operational State
              </span>
            </div>
          </div>

          {/* Quick Stat Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-[#042819] p-4 rounded-2xl border border-[#084c2e]">
              <span className="text-xs text-emerald-300 font-mono block">Active Prayers</span>
              <strong className="text-2xl font-bold text-[#f5cf72] font-mono">
                {prayerRequests.filter(p => p.status === 'new').length}
              </strong>
            </div>

            <div className="bg-[#042819] p-4 rounded-2xl border border-[#084c2e]">
              <span className="text-xs text-emerald-300 font-mono block">Expected Visitors</span>
              <strong className="text-2xl font-bold text-[#f5cf72] font-mono">
                {visitPlans.length}
              </strong>
            </div>

            <div className="bg-[#042819] p-4 rounded-2xl border border-[#084c2e]">
              <span className="text-xs text-emerald-300 font-mono block">Inquiries</span>
              <strong className="text-2xl font-bold text-[#f5cf72] font-mono">
                {contactMessages.length}
              </strong>
            </div>

            <div className="bg-[#042819] p-4 rounded-2xl border border-[#084c2e]">
              <span className="text-xs text-emerald-300 font-mono block">Summit & Events</span>
              <strong className="text-2xl font-bold text-[#f5cf72] font-mono">
                {events.length} Active
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-[#d6e5dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 py-3 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab('prayers')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'prayers'
                  ? 'bg-[#032014] text-[#f5cf72] shadow-sm border border-[#c99726]/40'
                  : 'text-[#07472c] hover:bg-[#eef6f1]'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#c99726]" />
              <span>Prayer Altar ({prayerRequests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('visits')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'visits'
                  ? 'bg-[#032014] text-[#f5cf72] shadow-sm border border-[#c99726]/40'
                  : 'text-[#07472c] hover:bg-[#eef6f1]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#c99726]" />
              <span>Visitor Plans ({visitPlans.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'messages'
                  ? 'bg-[#032014] text-[#f5cf72] shadow-sm border border-[#c99726]/40'
                  : 'text-[#07472c] hover:bg-[#eef6f1]'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-[#c99726]" />
              <span>Messages & Inquiries ({contactMessages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('placeholders')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'placeholders'
                  ? 'bg-[#032014] text-[#f5cf72] shadow-sm border border-[#c99726]/40'
                  : 'text-[#07472c] hover:bg-[#eef6f1]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#c99726]" />
              <span>Placeholder Registry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Tab 1: Prayer Requests */}
        {activeTab === 'prayers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#032014] font-serif-title">Petitions for Pastoral Intercession</h2>
              <span className="text-xs text-slate-500">Processed by Secretariat</span>
            </div>

            {prayerRequests.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-[#d6e5dc]">
                <p className="text-xs text-slate-500">No prayer requests in queue.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {prayerRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white p-6 rounded-2xl border border-[#d6e5dc] shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#eef6f1] text-[#07472c] rounded border border-[#c2decc]">
                          {req.category}
                        </span>
                        {req.isConfidential && (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-50 text-rose-700 rounded flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>Confidential</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-400">{req.dateSubmitted}</span>
                    </div>

                    <p className="text-sm text-slate-800 leading-relaxed font-sans">
                      "{req.requestText}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500 border-t border-slate-100">
                      <div>
                        <strong>Petitioner:</strong> {req.fullName} • <strong>Phone:</strong> {req.phone} • <strong>Email:</strong> {req.email}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-semibold text-slate-400">Status:</span>
                        <select
                          value={req.status}
                          onChange={(e) => onUpdatePrayerStatus(req.id, e.target.value as any)}
                          className="px-2.5 py-1 bg-[#f8faf8] border border-[#d6e5dc] rounded-lg text-xs font-mono font-semibold"
                        >
                          <option value="new">New / Active</option>
                          <option value="prayed">Prayed At Altar</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Visitor Plans */}
        {activeTab === 'visits' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#032014] font-serif-title">First-Time Visitors Roster</h2>
              <span className="text-xs text-slate-500">For Hospitality & Ushers Team</span>
            </div>

            {visitPlans.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-[#d6e5dc]">
                <p className="text-xs text-slate-500">No visitors planned yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visitPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white p-6 rounded-2xl border border-[#d6e5dc] shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#032014] text-base font-serif-title">{plan.fullName}</h3>
                      <span className="text-xs font-mono px-2.5 py-1 bg-[#eef6f1] text-[#07472c] rounded-lg font-bold border border-[#c2decc]">
                        {plan.serviceDate}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p><strong>Party Size:</strong> {plan.adultsCount} Adults, {plan.childrenCount} Children</p>
                      <p><strong>Contact:</strong> {plan.phone} | {plan.email}</p>
                      {plan.needAssistance && (
                        <p className="text-[#855e10] font-semibold">Assistance requested upon arrival.</p>
                      )}
                      {plan.specialNeeds && (
                        <p className="text-slate-500 italic">"{plan.specialNeeds}"</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">Received {plan.dateSubmitted}</span>
                      <select
                        value={plan.status}
                        onChange={(e) => onUpdateVisitStatus(plan.id, e.target.value as any)}
                        className="px-2 py-1 bg-[#f8faf8] border border-[#d6e5dc] rounded-lg font-mono text-xs"
                      >
                        <option value="planned">Planned</option>
                        <option value="followup-assigned">Host Assigned</option>
                        <option value="welcomed">Welcomed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Contact Messages */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#032014] font-serif-title">Inquiries & Correspondence</h2>
              <span className="text-xs text-slate-500">Church Office Inbox</span>
            </div>

            {contactMessages.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-[#d6e5dc]">
                <p className="text-xs text-slate-500">No incoming messages.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contactMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white p-6 rounded-2xl border border-[#d6e5dc] shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-bold text-[#032014] font-serif-title">{msg.subject}</strong>
                      <span className="text-xs font-mono text-slate-400">{msg.dateSubmitted}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                      <div>
                        From: <strong>{msg.fullName}</strong> ({msg.email} | {msg.phone})
                      </div>
                      <select
                        value={msg.status}
                        onChange={(e) => onUpdateMessageStatus(msg.id, e.target.value as any)}
                        className="px-2 py-1 bg-[#f8faf8] border border-[#d6e5dc] rounded-lg font-mono text-xs"
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Placeholder Registry */}
        {activeTab === 'placeholders' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#032014] font-serif-title">Branding & Data Placeholders</h2>
              <p className="text-xs text-slate-600">
                All church-specific facts use consistent, labelled bracket tokens as mandated. Below is the configuration manifest:
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#d6e5dc] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#eef6f1] text-[#07472c] font-mono font-bold uppercase border-b border-[#d6e5dc]">
                  <tr>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Placeholder Token</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                  <tr>
                    <td className="p-3.5 font-bold">Pastoral Oversight</td>
                    <td className="p-3.5 text-[#07472c] font-bold">[PASTOR NAME]</td>
                    <td className="p-3.5"><span className="text-[#07472c] bg-[#eef6f1] px-2 py-0.5 rounded border border-[#c2decc]">Active Token</span></td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Church Location</td>
                    <td className="p-3.5 text-[#07472c] font-bold">Star Junction, Tabora - Accra</td>
                    <td className="p-3.5"><span className="text-[#07472c] bg-[#eef6f1] px-2 py-0.5 rounded border border-[#c2decc] font-semibold">Configured</span></td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Landmark</td>
                    <td className="p-3.5 text-[#07472c] font-bold">Star Junction, Tabora</td>
                    <td className="p-3.5"><span className="text-[#07472c] bg-[#eef6f1] px-2 py-0.5 rounded border border-[#c2decc] font-semibold">Configured</span></td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Telephone Line</td>
                    <td className="p-3.5 text-[#07472c] font-bold">[CHURCH PHONE]</td>
                    <td className="p-3.5"><span className="text-[#07472c] bg-[#eef6f1] px-2 py-0.5 rounded border border-[#c2decc]">Active Token</span></td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">WhatsApp Direct</td>
                    <td className="p-3.5 text-[#07472c] font-bold">[WHATSAPP NUMBER]</td>
                    <td className="p-3.5"><span className="text-[#07472c] bg-[#eef6f1] px-2 py-0.5 rounded border border-[#c2decc]">Active Token</span></td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Official Email</td>
                    <td className="p-3.5 text-[#07472c] font-bold">[CHURCH EMAIL]</td>
                    <td className="p-3.5"><span className="text-[#07472c] bg-[#eef6f1] px-2 py-0.5 rounded border border-[#c2decc]">Active Token</span></td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">MoMo (MTN)</td>
                    <td className="p-3.5 text-[#07472c] font-bold">[MTN MOBILE MONEY DETAILS]</td>
                    <td className="p-3.5"><span className="text-[#07472c] bg-[#eef6f1] px-2 py-0.5 rounded border border-[#c2decc]">Active Token</span></td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Telecel Cash</td>
                    <td className="p-3.5 text-[#07472c] font-bold">[TELECEL CASH DETAILS]</td>
                    <td className="p-3.5"><span className="text-[#07472c] bg-[#eef6f1] px-2 py-0.5 rounded border border-[#c2decc]">Active Token</span></td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">AT Money</td>
                    <td className="p-3.5 text-[#07472c] font-bold">[AT MONEY DETAILS]</td>
                    <td className="p-3.5"><span className="text-[#07472c] bg-[#eef6f1] px-2 py-0.5 rounded border border-[#c2decc]">Active Token</span></td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Bank Account</td>
                    <td className="p-3.5 text-[#07472c] font-bold">[BANK DETAILS]</td>
                    <td className="p-3.5"><span className="text-[#07472c] bg-[#eef6f1] px-2 py-0.5 rounded border border-[#c2decc]">Active Token</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
