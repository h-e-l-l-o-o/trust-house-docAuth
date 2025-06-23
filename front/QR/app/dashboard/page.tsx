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
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  FileText,
  User,
  Upload,
  Eye,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import useDoc from "@/hooks/useDoc";
import { useAuthContext } from "@/context/AuthProvider";

interface DashboardStats {
  totalDocuments: number;
  activeDocuments: number;
  expiredDocuments: number;
}

export default function DashboardPage() {
  const { jwt, authError, fetchNewJwt } = useAuthContext();
  const { docs } = useDoc(jwt, fetchNewJwt, 0);

  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    activeDocuments: 0,
    expiredDocuments: 0,
  });

  useEffect(() => {
    setStats({
      totalDocuments: docs.documents.length,
      activeDocuments: docs.activeDocs,
      expiredDocuments: docs.expiredDocs,
    });
  }, [docs]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="h-4 w-4 text-blue-600" />;
      case "expire":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Here's your document overview.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/dashboard/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Documents
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDocuments}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.activeDocuments / stats.totalDocuments) * 100).toFixed(
                  1
                )}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Expired Documents
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expiredDocuments}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start">
                <Link href="/dashboard/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Document
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/dashboard/documents">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Documents
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Status Overview</CardTitle>
            <CardDescription>
              Current status distribution of your documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Active Documents
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {stats.activeDocuments}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-900">Expired</p>
                  <p className="text-2xl font-bold text-red-900">
                    {stats.expiredDocuments}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
