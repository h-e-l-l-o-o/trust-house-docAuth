"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Eye, Edit, Trash2, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import { useAuthContext } from "@/context/AuthProvider";
import { CreateUserModal } from "@/components/CreateUserModal";
import { EditUserRolesModal } from "@/components/EditUserModal";

interface User {
  userID: number;
  userName: string;
  email: string;
  empFName: string;
  empSName: string;
  empThName: string;
  empFtName: string;
  idNo: string;
  idDate: string;
  rolesCsv?: string;
}

export default function Users() {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [editOpenUserID, setEditOpenUserID] = useState<number | null>(null);

  const { jwt, fetchNewJwt } = useAuthContext();
  const {
    users,
    setUserRefresh,
    userLoading,
    createUser,
    setUserRoles,
    deleteUser,
  } = useUser(jwt, fetchNewJwt, 0);

  // Whenever `users` or searchTerm changes, recalc filteredUsers.
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter((user: User) =>
        [
          user.email,
          user.empFName,
          user.empSName,
          user.empThName,
          user.empFtName,
          user.userName,
        ]
          .map((str) => str.toLowerCase())
          .some((field) => field.includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const handleDeleteUser = (id: number) => {
    deleteUser(id);
    setUserRefresh(Date.now());
  };

  // Helper: return appropriate Tailwind classes for each role
  function roleBadgeClasses(role: string) {
    switch (role) {
      case "CanWrite":
        return "bg-yellow-100 text-yellow-800";
      case "CanRead":
        return "bg-blue-100 text-blue-800";
      case "CanDelete":
        return "bg-red-100 text-red-800";
      case "Admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">All Users</h1>
            <p className="text-sm text-muted-foreground">
              Manage and view all your Users
            </p>
          </div>
          <Button asChild>
            <CreateUserModal
              create={createUser}
              loading={userLoading}
              setRefresh={setUserRefresh}
            />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>User Library</CardTitle>
                <CardDescription>
                  {filteredUsers.length} of {users.length} Users
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Box */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Number</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Second Name</TableHead>
                    <TableHead>UserName</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user: User) => (
                      <TableRow key={user.userID.toString()}>
                        <TableCell className="font-medium">
                          {user.idNo}
                        </TableCell>
                        <TableCell>{user.empFName}</TableCell>
                        <TableCell>{user.empSName}</TableCell>
                        <TableCell>{user.userName}</TableCell>
                        <TableCell>{user.email}</TableCell>

                        {/* Roles Column */}
                        <TableCell>
                          {user.rolesCsv ? (
                            <div className="flex flex-wrap gap-2">
                              {user.rolesCsv
                                .split(",")
                                .map((role) => role.trim())
                                .filter((r) => r)
                                .map((role) => (
                                  <Badge
                                    key={role}
                                    className={`px-2 py-1 rounded-full text-xs ${roleBadgeClasses(
                                      role
                                    )}`}
                                  >
                                    {role}
                                  </Badge>
                                ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>

                        {/* Actions Column */}
                        <TableCell>
                          {/* Each row’s “Edit” button: sets editOpenUserID to this user’s ID */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/Users/${user.userID}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View User Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditOpenUserID(user.userID as number);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteUser(user.userID as number)
                                }
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {/* The EditUserRolesModal for this row */}
                          <EditUserRolesModal
                            loading={userLoading}
                            userID={user.userID}
                            updateRoles={setUserRoles}
                            setRefresh={setUserRefresh}
                            open={editOpenUserID === user.userID}
                            setOpen={(open) => {
                              if (!open) {
                                setEditOpenUserID(null);
                              }
                            }}
                            initialRolesCSV={user.rolesCsv || ""}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
