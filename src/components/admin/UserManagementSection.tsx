import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types';
import { 
  Users, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  HardHat, 
  User, 
  MoreVertical, 
  Check, 
  X, 
  Edit3, 
  Key, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface UserManagementSectionProps {
  users: UserProfile[];
  onUpdateUsers: (updated: UserProfile[]) => void;
}

export const UserManagementSection: React.FC<UserManagementSectionProps> = ({
  users,
  onUpdateUsers,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserProfile | null>(null);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('customer');
  const [newLicense, setNewLicense] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.licenseNumber && u.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.organization && u.organization.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, targetRole: UserRole) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, role: targetRole } : u));
    onUpdateUsers(updated);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      licenseNumber: newLicense ? newLicense : undefined,
      organization: newOrg ? newOrg : undefined,
      phone: newPhone ? newPhone : '+91 98400 12345',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    onUpdateUsers([newUser, ...users]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewLicense('');
    setNewOrg('');
    setNewPhone('');
  };

  const handleSaveUserEdits = () => {
    if (!selectedUserForEdit) return;
    const updated = users.map((u) => (u.id === selectedUserForEdit.id ? selectedUserForEdit : u));
    onUpdateUsers(updated);
    setSelectedUserForEdit(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to remove this user from the platform directory?')) {
      onUpdateUsers(users.filter((u) => u.id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-500" />
            <span>Platform User Directory & Role Assignment</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage user accounts, assign Civil Engineering PE privileges, modify organizational access, and provision credentials.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add New Platform User
        </button>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search name, email, PE license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400">Role Filter:</span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {(['all', 'customer', 'engineer', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  roleFilter === r
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">User Account</th>
                <th className="py-4 px-6">Contact & Phone</th>
                <th className="py-4 px-6">PE License / Org</th>
                <th className="py-4 px-6">Assigned Role</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={u.name}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-700"
                    />
                    <div>
                      <span className="font-bold text-white text-sm block">{u.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {u.id}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="space-y-0.5">
                      <p className="font-mono text-slate-300 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-500" /> {u.email}
                      </p>
                      {u.phone && (
                        <p className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-500" /> {u.phone}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    {u.licenseNumber ? (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20 inline-block">
                        {u.licenseNumber}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">{u.organization || 'Individual Owner'}</span>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${
                        u.role === 'admin'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : u.role === 'engineer'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      <option value="customer" className="bg-slate-900 text-white">Customer</option>
                      <option value="engineer" className="bg-slate-900 text-white">Civil Engineer</option>
                      <option value="admin" className="bg-slate-900 text-white">Admin</option>
                    </select>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedUserForEdit(u)}
                        className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl transition-all"
                        title="Edit User Details"
                      >
                        <Edit3 className="w-4 h-4 text-amber-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 bg-slate-950 border border-slate-800 hover:border-rose-900/50 text-slate-400 hover:text-rose-400 rounded-xl transition-all"
                        title="Remove User"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-rose-500" />
                <span>Create Platform User Account</span>
              </h4>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Robert Chen, PE"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. robert.chen@engineering.com"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Account Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500 font-semibold"
                  >
                    <option value="customer">Customer</option>
                    <option value="engineer">Civil Engineer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {newRole === 'engineer' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">PE Structural License Number</label>
                  <input
                    type="text"
                    value={newLicense}
                    onChange={(e) => setNewLicense(e.target.value)}
                    placeholder="e.g. PE-TX-99201-STRUCT"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Organization / Firm</label>
                <input
                  type="text"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  placeholder="e.g. Chen Structural Engineering Associates"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit User Modal */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <span>Edit User Profile Details</span>
              </h4>
              <button onClick={() => setSelectedUserForEdit(null)} className="text-slate-400 hover:text-white">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={selectedUserForEdit.name}
                  onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={selectedUserForEdit.email}
                  onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">PE License Number</label>
                <input
                  type="text"
                  value={selectedUserForEdit.licenseNumber || ''}
                  onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, licenseNumber: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Organization</label>
                <input
                  type="text"
                  value={selectedUserForEdit.organization || ''}
                  onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, organization: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedUserForEdit(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUserEdits}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
