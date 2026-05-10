"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=10`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-center">Trips</th>
              <th className="px-6 py-3">Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)] mx-auto" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.fullName} <span className="text-gray-500 text-xs ml-1">@{user.username}</span></td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.role === "ADMIN" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        <ShieldAlert className="w-3 h-3 mr-1" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-[var(--primary)]">{user.tripsCount}</td>
                  <td className="px-6 py-4 text-gray-500">{format(new Date(user.createdAt), "MMM d, yyyy")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && pagination.totalPages > 1 && (
        <div className="p-4 border-t flex justify-between items-center bg-gray-50">
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={pagination.page <= 1}
              onClick={() => fetchUsers(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchUsers(pagination.page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
