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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import Link from "next/link";
import useDoc from "@/hooks/useDoc";
import { useAuthContext } from "@/context/AuthProvider";
import { EditModal } from "@/components/EditModal";

const docStatuses: { statusID: number; status: string }[] = [
  { statusID: 2, status: "Under Process" },
  { statusID: 3, status: "Complete" },
  { statusID: 4, status: "Deleted" },
];

interface Document {
  id: string;
  documentNumber: string;
  documentType: string;
  docDesc: string;
  fileName: string;
  issueDate: string;
  expiryDate: string;
  statusID: number;
  status: string;
  isExpired: boolean;
  uploadedBy: string;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [typeFilter, setTypeFilter] = useState("all");

  const { jwt, fetchNewJwt } = useAuthContext();
  const { docs, docLoading, editDoc, downloadDoc, setDocRefresh, deleteDoc } = useDoc(
    jwt,
    fetchNewJwt,
    0
  );

  const [editOpenId, setEditOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!docs || !docs.documents) return;

    const now = new Date();
    const mapped: Document[] = docs.documents.map((d: any) => {
      const statusEntry = docStatuses.find((s) => s.statusID === d.docStatusID);
      const statusText = statusEntry ? statusEntry.status : "Unknown";

      const expiryDateObj = new Date(d.expiryDate);
      const expiredFlag = expiryDateObj < now;

      return {
        id: d.docID.toString(),
        documentNumber: d.docNumber,
        documentType: d.docType,
        docDesc: d.docDesc,
        fileName: d.filePath,
        issueDate: d.docDate,
        expiryDate: d.expiryDate,
        statusID: d.docStatusID,
        status: statusText,
        isExpired: expiredFlag,
        uploadedBy: d.createdByEmail,
        uploadedAt: d.uploadedAt,
      };
    });

    setDocuments(mapped);
  }, [docs]);

  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.documentNumber.toLowerCase().includes(lower) ||
          doc.documentType.toLowerCase().includes(lower) ||
          doc.fileName.toLowerCase().includes(lower)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (doc) => doc.statusID.toString() === statusFilter
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.documentType === typeFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, statusFilter, typeFilter]);

  const handleDeleteDocument = async (id: any) => {
     const res = await deleteDoc(id)
     if(res.statusCode == 200){
      setDocRefresh(Date.now())
     }
  };

  const getDocStatusBadge = (statusID: number, statusText: string) => {
    console.log(statusText)
    switch (statusID) {
      case 2:
        return (
          <Badge className="bg-blue-100 text-blue-800">{statusText}</Badge>
        );
      case 3:
        return (
          <Badge className="bg-green-100 text-green-800">{statusText}</Badge>
        );
      case 4:
        return <Badge className="bg-red-100 text-red-800">{statusText}</Badge>;
      default:
        return <Badge variant="secondary">{statusText}</Badge>;
    }
  };

  const getExpiredBadge = (expired: boolean) => {
    if (expired) {
      return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
  };

  //
  // 7. Compute unique types for the “Filter by type” dropdown
  //
  const documentTypes = Array.from(
    new Set(documents.map((doc) => doc.documentType))
  );

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">All Documents</h1>
            <p className="text-sm text-muted-foreground">
              Manage and view all your documents
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/upload">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Document Library</CardTitle>
                <CardDescription>
                  {filteredDocuments.length} of {documents.length} documents
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* ─── Text Search ────────────────────────────────────────────── */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* ─── Filter by numeric statusID ───────────────────────────── */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {docStatuses.map((st) => (
                    <SelectItem
                      key={st.statusID}
                      value={st.statusID.toString()}
                    >
                      {st.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* ─── Filter by Document Type ───────────────────────────────── */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Is Expired</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        No documents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {doc.documentNumber}
                        </TableCell>
                        <TableCell>{doc.documentType}</TableCell>
                        <TableCell>{doc.fileName}</TableCell>
                        <TableCell>
                          {new Date(doc.issueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(doc.expiryDate).toLocaleDateString()}
                        </TableCell>

                        {/* ─── Show the mapped “Status” badge ─────────────────── */}
                        <TableCell>
                          {getDocStatusBadge(doc.statusID, doc.status)}
                        </TableCell>

                        {/* ─── Show “Active” vs “Expired” badge ───────────────── */}
                        <TableCell>{getExpiredBadge(doc.isExpired)}</TableCell>

                        {/* ─── Actions Column ─────────────────────────────────── */}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/documents/${doc.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => downloadDoc(doc.fileName)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={doc.statusID === 4}
                                  onClick={() => setEditOpenId(doc.id)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={doc.statusID === 4}
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <EditModal
                              id={doc.id}
                              isOpen={editOpenId === doc.id}
                              setRefresh={setDocRefresh}
                              setOpen={(open) => {
                                if (!open) {
                                  setEditOpenId(null);
                                }
                              }}
                              upload={editDoc}
                              loading={docLoading}
                            />
                          </div>
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
