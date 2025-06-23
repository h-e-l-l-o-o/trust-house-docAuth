"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthProvider";
import useUser from "@/hooks/useUser";
import { EditUserRolesModal } from "@/components/EditUserModal";

interface User {
  userID: number;
  userName: string;
  email: string;
  empFName: string;
  empSName: string;
  empThName: string;
  empFmName: string;
  idNo: string;
  idDate: string;
  rolesCsv?: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editOpenUserID, setEditOpenUserID] = useState<number | null>(null);

  const { jwt, fetchNewJwt } = useAuthContext();
  const { users, userLoading, deleteUser, setUserRefresh, setUserRoles } = useUser(
    jwt,
    fetchNewJwt,
    0
  );

  useEffect(() => {
    if (!userLoading && users.length > 0) {
      const uid = Number(params.id);
      const found = users.find((u: any) => u.userID === uid) || null;
      setUser(found);
    }
  }, [params.id, users, userLoading]);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(user!.userID);
      setUserRefresh(Date.now());
      router.push("/dashboard/Users");
    }
  };

  if (userLoading) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold">Loading...</h1>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold">User Not Found</h1>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                The user you’re looking for could not be found.
              </p>
              <Button asChild>
                <Link href="/dashboard/users">Back to Users</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Format roles into individual badges
  const roleBadges = user.rolesCsv
    ? user.rolesCsv
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r)
    : [];

  // Helper for badge colors
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
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">{user.userName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpenUserID(user.userID as number)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>

            <Button variant="outline" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>

            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/users">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>
              View all information for this user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold">Full Name:</p>
                <p>
                  {user.empFName} {user.empSName} {user.empThName}{" "}
                  {user.empFmName}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold">ID Number:</p>
                <p>{user.idNo}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">ID Date:</p>
                <p>{new Date(user.idDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Username:</p>
                <p>{user.userName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-semibold">Email:</p>
                <p>{user.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-semibold">Roles:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {roleBadges.length > 0 ? (
                    roleBadges.map((role) => (
                      <Badge
                        key={role}
                        className={`px-2 py-1 rounded-full text-xs ${roleBadgeClasses(
                          role
                        )}`}
                      >
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500">No roles assigned</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
