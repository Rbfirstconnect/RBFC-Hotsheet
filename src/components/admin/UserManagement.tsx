import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { UserPlus, Users, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  status: string;
  user_roles: Array<{
    roles: {
      name: string;
      id: string;
    };
  }>;
}

interface Role {
  id: string;
  name: string;
}

interface FormData {
  username: string;
  email: string;
  full_name: string;
  phone: string;
  role_id: string;
  password: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    full_name: '',
    phone: '',
    role_id: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select(`
        *,
        user_roles (
          roles (
            name,
            id
          )
        )
      `);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    setUsers(usersData || []);
  };

  const fetchRoles = async () => {
    const { data: rolesData, error: rolesError } = await supabase
      .from('roles')
      .select('*');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return;
    }

    setRoles(rolesData || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      const updateData: any = {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        phone: formData.phone,
        updated_at: new Date()
      };

      if (formData.password) {
        updateData.encrypted_password = formData.password;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', editingUser.id);

      if (updateError) {
        console.error('Error updating user:', updateError);
        return;
      }

      if (formData.role_id) {
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', editingUser.id);

        await supabase
          .from('user_roles')
          .insert({
            user_id: editingUser.id,
            role_id: formData.role_id
          });
      }
    } else {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          phone: formData.phone,
          encrypted_password: formData.password
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return;
      }

      if (formData.role_id && newUser) {
        await supabase
          .from('user_roles')
          .insert({
            user_id: newUser.id,
            role_id: formData.role_id
          });
      }
    }

    setFormData({
      username: '',
      email: '',
      full_name: '',
      phone: '',
      role_id: '',
      password: ''
    });
    setEditingUser(null);
    setShowAddForm(false);
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      full_name: user.full_name || '',
      phone: user.phone || '',
      role_id: user.user_roles?.[0]?.roles?.id || '',
      password: ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (userId: string) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      return;
    }

    fetchUsers();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#ff6900] flex items-center gap-2">
          <Users className="w-6 h-6" />
          User Management
        </h2>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingUser(null);
            setFormData({
              username: '',
              email: '',
              full_name: '',
              phone: '',
              role_id: '',
              password: ''
            });
          }}
          className="bg-[#ff6900] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#ff8533] transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-2 border rounded focus:ring-[#ff6900] focus:border-[#ff6900] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded focus:ring-[#ff6900] focus:border-[#ff6900] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2 border rounded focus:ring-[#ff6900] focus:border-[#ff6900] outline-none"
                required={!editingUser}
                placeholder={editingUser ? "Leave blank to keep current password" : ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full p-2 border rounded focus:ring-[#ff6900] focus:border-[#ff6900] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded focus:ring-[#ff6900] focus:border-[#ff6900] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                className="w-full p-2 border rounded focus:ring-[#ff6900] focus:border-[#ff6900] outline-none"
                required
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingUser(null);
                setFormData({
                  username: '',
                  email: '',
                  full_name: '',
                  phone: '',
                  role_id: '',
                  password: ''
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#ff6900] text-white rounded-lg hover:bg-[#ff8533] transition-colors"
            >
              {editingUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.full_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {user.user_roles?.[0]?.roles?.name || 'No role'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-[#ff6900] hover:text-[#ff8533] mr-3"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;