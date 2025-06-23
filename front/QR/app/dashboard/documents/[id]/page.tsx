"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, Edit, Trash2, Download } from "lucide-react";
import Link from "next/link";
import { DocumentViewer } from "@/components/document-viewer";
import { useAuthContext } from "@/context/AuthProvider";
import useDoc from "@/hooks/useDoc";
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

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const { jwt, fetchNewJwt } = useAuthContext();
  const { docs, docLoading, editDoc, downloadDoc, setDocRefresh, deleteDoc } =
    useDoc(jwt, fetchNewJwt, params.id);

  useEffect(() => {
    if (!docs || docs.documents[0]) {
      const d = docs.documents[0];
      const statusEntry = docStatuses.find((s) => s.statusID === d.docStatusID);
      const statusText = statusEntry ? statusEntry.status : "Unknown";

      const expiryDateObj = new Date(d.expiryDate);
      const expiredFlag = expiryDateObj < new Date();

      const doc: Document = {
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

      setDocument(doc);
    }
  }, [params.id, docs]);

  const handleDelete = async (docID: any) => {
    if (confirm("Are you sure you want to delete this document?")) {
      const res = await deleteDoc(docID);
      if (res.statusCode == 200) {
        router.push("/dashboard/documents");
      }
    }
  };

  if (docLoading) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Loading...</h1>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Document Not Found</h1>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                The document you're looking for could not be found.
              </p>
              <Button asChild>
                <Link href="/dashboard/documents">Back to Documents</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{document.documentNumber}</h1>
            <p className="text-sm text-muted-foreground">
              {document.documentType}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <EditModal
              id={document.id}
              isOpen={editOpen}
              setRefresh={setDocRefresh}
              setOpen={setEditOpen}
              upload={editDoc}
              loading={docLoading}
            />{" "}
            <Button
              onClick={() => setEditOpen(true)}
              disabled={document.statusID === 4}
              variant="outline"
              size="sm"
            >
              Edit
            </Button>
            <Button
              onClick={() => downloadDoc(document.fileName)}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              disabled={document.statusID === 4}
              variant="outline"
              size="sm"
              onClick={() => handleDelete(document.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/documents">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <DocumentViewer
          statuses={docStatuses}
          download={downloadDoc}
          document={document}
        />
      </main>
    </div>
  );
}
