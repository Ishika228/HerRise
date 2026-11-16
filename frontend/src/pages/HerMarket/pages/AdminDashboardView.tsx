import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Search,
  Filter,
  Save,
  X
} from 'lucide-react';
import {
  HerMarketPackage,
  HerMarketService,
  ServiceRequestItem,
  formatAUD,
  saveStoredPackages,
  saveStoredServices,
  saveStoredRequests
} from '../data/herMarketData';

interface AdminDashboardViewProps {
  packages: HerMarketPackage[];
  services: HerMarketService[];
  requests: ServiceRequestItem[];
  onUpdatePackages: (pkgs: HerMarketPackage[]) => void;
  onUpdateServices: (srvs: HerMarketService[]) => void;
  onUpdateRequests: (reqs: ServiceRequestItem[]) => void;
  onExitAdmin: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  packages,
  services,
  requests,
  onUpdatePackages,
  onUpdateServices,
  onUpdateRequests,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'packages' | 'services'>('requests');

  // Service Edit/Add modal state
  const [editingService, setEditingService] = useState<Partial<HerMarketService> | null>(null);
  const [editingPackage, setEditingPackage] = useState<HerMarketPackage | null>(null);

  // Computed metrics
  const totalRequests = requests.length;
  const uniqueCustomers = new Set(requests.map((r) => r.email)).size;
  const activeProjects = requests.filter((r) => r.status === 'In Progress' || r.status === 'Quotation Sent').length;
  const completedProjects = requests.filter((r) => r.status === 'Completed').length;
  const totalDemoRevenue = requests.reduce((acc, curr) => acc + curr.oneTimeTotal, 0);

  // Status changer
  const handleStatusChange = (id: string, newStatus: ServiceRequestItem['status']) => {
    const updated = requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    onUpdateRequests(updated);
    saveStoredRequests(updated);
  };

  // Delete service
  const handleDeleteService = (id: string) => {
    if (!window.confirm('Are you sure you want to remove this service?')) return;
    const updated = services.filter((s) => s.id !== id);
    onUpdateServices(updated);
    saveStoredServices(updated);
  };

  // Save Service
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.name || !editingService?.price) return;

    if (editingService.id) {
      // Edit
      const updated = services.map((s) =>
        s.id === editingService.id ? ({ ...s, ...editingService } as HerMarketService) : s
      );
      onUpdateServices(updated);
      saveStoredServices(updated);
    } else {
      // Create
      const newSrv: HerMarketService = {
        id: `srv-${Date.now().toString().slice(-4)}`,
        name: editingService.name,
        category: (editingService.category as any) || 'Design',
        description: editingService.description || '',
        price: Number(editingService.price),
        period: editingService.period || 'one-time',
        image:
          editingService.image ||
          'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=600&q=80',
        features: editingService.features || ['Professional Delivery', 'Revisions Included']
      };
      const updated = [...services, newSrv];
      onUpdateServices(updated);
      saveStoredServices(updated);
    }
    setEditingService(null);
  };

  // Save Package
  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    const updated = packages.map((p) => (p.id === editingPackage.id ? editingPackage : p));
    onUpdatePackages(updated);
    saveStoredPackages(updated);
    setEditingPackage(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Demo Banner */}
      <div className="bg-amber-500/10 border-2 border-amber-400 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/30 text-amber-950 px-2 py-0.5 rounded">
                DEMO ROLE
              </span>
              <h2 className="text-sm font-extrabold text-amber-950">
                HerMarket Administrator Console
              </h2>
            </div>
            <p className="text-xs text-amber-900 mt-0.5">
              Live pricing modification, feature list updates, and request pipeline status controls.
            </p>
          </div>
        </div>

        <button
          onClick={onExitAdmin}
          className="py-2 px-4 rounded-xl text-xs font-bold bg-white text-gray-700 hover:bg-gray-100 border border-amber-300 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          Exit Admin Mode
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Requests</span>
            <TrendingUp className="w-4 h-4 text-[#4A154B]" />
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">{totalRequests}</div>
          <div className="text-[10px] text-gray-400 mt-1">Client leads submitted</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Customers</span>
            <Users className="w-4 h-4 text-[#4A154B]" />
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">{uniqueCustomers}</div>
          <div className="text-[10px] text-gray-400 mt-1">Unique businesses</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Active Projects</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 mt-2">{activeProjects}</div>
          <div className="text-[10px] text-gray-400 mt-1">Currently in progress</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{completedProjects}</div>
          <div className="text-[10px] text-gray-400 mt-1">Delivered engagements</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Project Scope</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#4A154B] mt-2">
            {formatAUD(totalDemoRevenue)}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Pipeline scope value</div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center justify-between border-b border-purple-100 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'bg-white border border-purple-100 text-gray-700 hover:bg-purple-50'
            }`}
          >
            Client Enquiries ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'bg-white border border-purple-100 text-gray-700 hover:bg-purple-50'
            }`}
          >
            Package Management ({packages.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'bg-white border border-purple-100 text-gray-700 hover:bg-purple-50'
            }`}
          >
            Individual Services ({services.length})
          </button>
        </div>

        {activeTab === 'services' && (
          <button
            onClick={() =>
              setEditingService({
                name: '',
                category: 'Design',
                price: 999,
                period: 'one-time',
                description: '',
                features: ['Feature 1', 'Feature 2']
              })
            }
            className="py-2 px-3.5 rounded-xl text-xs font-bold bg-[#4A154B] text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {/* TAB 1: REQUESTS PIPELINE TABLE */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-purple-50/60 border-b border-purple-100 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-4">Customer & Business</th>
                  <th className="p-4">Package / Services</th>
                  <th className="p-4">Estimated Scope</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{req.customerName}</div>
                      <div className="text-[11px] text-gray-500">{req.businessName}</div>
                      <div className="text-[10px] text-gray-400">{req.phone}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-bold text-[#4A154B]">
                        {req.selectedPackageName || 'Individual Services'}
                      </div>
                      <div className="text-[11px] text-gray-500 line-clamp-1">
                        {req.servicesRequired.join(', ') || 'No add-ons'}
                      </div>
                    </td>
                    <td className="p-4 font-black text-gray-900">
                      {formatAUD(req.oneTimeTotal)}
                      {req.monthlyTotal > 0 && (
                        <div className="text-[10px] text-amber-800 font-normal">
                          +{formatAUD(req.monthlyTotal)}/mo
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-500">{req.requestDate}</td>
                    <td className="p-4">
                      <select
                        value={req.status}
                        onChange={(e) =>
                          handleStatusChange(req.id, e.target.value as ServiceRequestItem['status'])
                        }
                        className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold outline-none bg-white focus:border-[#4A154B]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Quotation Sent">Quotation Sent</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PACKAGES MANAGEMENT */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#4A154B] bg-purple-50 px-2 py-0.5 rounded">
                    {pkg.id}
                  </span>
                  <button
                    onClick={() => setEditingPackage({ ...pkg })}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#4A154B] hover:bg-purple-50 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-base font-black text-gray-900 mt-2">{pkg.name}</h3>
                <div className="text-2xl font-black text-[#4A154B] mt-1">{formatAUD(pkg.price)} AUD</div>
                <p className="text-xs text-gray-500 mt-2">{pkg.targetCustomers}</p>

                <div className="mt-4 pt-3 border-t border-purple-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Features ({pkg.features.length})
                  </span>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {pkg.features.slice(0, 5).map((f, idx) => (
                      <li key={idx} className="truncate">
                        • {f}
                      </li>
                    ))}
                    {pkg.features.length > 5 && (
                      <li className="text-[10px] text-gray-400">
                        + {pkg.features.length - 5} more features
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setEditingPackage({ ...pkg })}
                className="w-full py-2 rounded-xl text-xs font-bold border border-purple-200 text-[#4A154B] hover:bg-purple-50 transition-colors cursor-pointer"
              >
                Edit Price & Features
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SERVICES MANAGEMENT */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl border border-purple-100 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {srv.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingService({ ...srv })}
                      className="p-1 rounded-lg text-gray-400 hover:text-[#4A154B] hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-extrabold text-gray-900 mt-2">{srv.name}</h4>
                <div className="text-base font-black text-[#4A154B] mt-1">
                  {formatAUD(srv.price)}
                  <span className="text-[10px] text-gray-400 font-normal ml-1">
                    {srv.period === 'monthly' ? '/month' : 'one-time'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{srv.description}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-purple-50 flex justify-end">
                <button
                  onClick={() => setEditingService({ ...srv })}
                  className="text-xs font-bold text-[#4A154B] hover:underline cursor-pointer"
                >
                  Edit Service
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Edit Modal */}
      {editingPackage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setEditingPackage(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-gray-900">
                Edit Package: {editingPackage.name}
              </h3>
              <button onClick={() => setEditingPackage(null)} className="cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={editingPackage.name}
                  onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Demo Price (AUD A$)
                </label>
                <input
                  type="number"
                  required
                  value={editingPackage.price}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Customers</label>
                <input
                  type="text"
                  value={editingPackage.targetCustomers}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, targetCustomers: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  rows={5}
                  value={editingPackage.features.join('\n')}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      features: e.target.value.split('\n').filter((l) => l.trim().length > 0)
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl text-xs font-bold bg-[#4A154B] text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Edit/Add Modal */}
      {editingService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setEditingService(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-gray-900">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setEditingService(null)} className="cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.name || ''}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  placeholder="e.g. Logo Design"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (AUD A$)</label>
                  <input
                    type="number"
                    required
                    value={editingService.price || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Billing Period</label>
                  <select
                    value={editingService.period || 'one-time'}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        period: e.target.value as 'one-time' | 'monthly'
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                  >
                    <option value="one-time">One-time setup</option>
                    <option value="monthly">Monthly retainer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={editingService.category || 'Design'}
                  onChange={(e) =>
                    setEditingService({ ...editingService, category: e.target.value as any })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                >
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Content">Content</option>
                  <option value="SEO">SEO</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingService.description || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl text-xs font-bold bg-[#4A154B] text-white"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
