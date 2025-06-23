"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  QrCode,
  Calendar,
  FileText,
  Mail,
  User,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

interface Document {
  id: string;
  documentNumber: string;
  documentType: string;
  fileName: string;
  issueDate: string;
  expiryDate: string;
  customerEmail?: string;
  status: "active" | "expired";
  qrCode?: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface DocumentViewerProps {
  document: any;
  download: any;
  statuses: any;
}

export function DocumentViewer({
  document,
  download,
  statuses,
}: DocumentViewerProps) {

  const getDocStatusBadge = (statusID: number, statusText: string) => {
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


  return (
    <div className="space-y-6">
      <div className="">
        {" "}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Document Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Document Number
                </p>
                <p className="text-sm text-gray-900">
                  {document.documentNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Type</p>
                <p className="text-sm text-gray-900">{document.documentType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">File Name</p>
                <p className="text-sm text-gray-900">{document.fileName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                {getDocStatusBadge(document.statusID, document.status)}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Issue Date</p>
                <p className="text-sm text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(document.issueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Expiry Date</p>
                <p className="text-sm text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(document.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {document.customerEmail && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Customer Email
                  </p>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {document.customerEmail}
                  </p>
                </div>
              </>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Uploaded By</p>
                <p className="text-sm text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {document.uploadedBy}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Upload Date</p>
                <p className="text-sm text-gray-900">
                  {new Date(document.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {document.fileName}
            </p>
            <Button onClick={() => download(document.fileName)}>
              <Download className="h-4 w-4 mr-2" />
              Download Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
