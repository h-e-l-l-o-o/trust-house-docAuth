"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Hash } from "lucide-react";

const docStatuses: any = [
  { statusID: 2, status: "Under Process" },
  { statusID: 3, status: "Complete" },
];

export function DocumentUploadForm({ create, docTypes, loading }: any) {
  const [formData, setFormData] = useState<any>({
    documentNumber: "",
    documentType: "",
    fileName: "",
    docStatus: "",
    docDesc: "",
    issueDate: "",
    expiryDate: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (selectedFile) {
      setFile(selectedFile);
      setFormData((prev: any) => ({
        ...prev,
        fileName: selectedFile.name,
      }));
    }
  };

  const generateDocumentNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `DOC-${year}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = new FormData();
    body.append("DocTypeID", formData.documentType.docTypeID);
    body.append("DocStatusID", formData.docStatus.statusID);
    body.append("DocNumber", formData.documentNumber);
    body.append("DocDate", formData.issueDate);
    body.append("DocDesc", formData.docDesc);
    body.append("ExpiryDate", formData.expiryDate);
    body.append("File", file!, file?.name);

    create(body);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="file">Document File</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            id="file"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            required
          />
          <label htmlFor="file" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              {file ? file.name : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500">PDF up to 100MB</p>
          </label>
        </div>
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document Number */}
        <div className="space-y-2">
          <Label htmlFor="documentNumber">Document Number</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="documentNumber"
              required
              placeholder={
                formData.autoGenerateNumber
                  ? "Auto-generated"
                  : "Enter document number"
              }
              value={
                formData.autoGenerateNumber
                  ? generateDocumentNumber()
                  : formData.documentNumber
              }
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  documentNumber: e.target.value,
                }))
              }
              disabled={formData.autoGenerateNumber}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  documentNumber: generateDocumentNumber(),
                }))
              }
            >
              <Hash className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            {formData.autoGenerateNumber
              ? "Number will be auto-generated"
              : "Enter custom document number"}
          </p>
        </div>

        {/* Document Status */}
        <div className="space-y-2">
          <Label htmlFor="documentType">Document Status</Label>
          <Select
            required={true}
            value={formData.docStatus?.statusID?.toString() ?? ""}
            onValueChange={(value) => {
              const selected = docStatuses.find(
                (type: any) => type.statusID.toString() === value
              );
              setFormData((prev: any) => ({
                ...prev,
                docStatus: selected ?? prev.docStatus,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select document status" />
            </SelectTrigger>
            <SelectContent>
              {docStatuses.map((type: any) => (
                <SelectItem
                  key={type.statusID}
                  value={type.statusID.toString()}
                >
                  {type.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentType">Document Type</Label>
          <Select
            required={true}
            value={formData.documentType?.docTypeID?.toString() ?? ""}
            onValueChange={(value) => {
              const selected = docTypes.find(
                (type: any) => type.docTypeID.toString() === value
              );
              setFormData((prev: any) => ({
                ...prev,
                documentType: selected ?? prev.documentType,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {docTypes.map((type: any) => (
                <SelectItem
                  key={type.docTypeID}
                  value={type.docTypeID.toString()}
                >
                  {type.docTypeDesc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Doc Desc */}
        <div className="space-y-2">
          <Label htmlFor="Doc Desc">Document Description</Label>
          <Input
            id="Doc Desc"
            type="text"
            maxLength={255}
            value={formData.docDesc}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                docDesc: e.target.value,
              }))
            }
            required
          />
        </div>

        {/* Issue Date */}
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                issueDate: e.target.value,
              }))
            }
            required
          />
        </div>

        {/* Expiry Date */}
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                expiryDate: e.target.value,
              }))
            }
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !file}>
          {loading ? "Processing..." : "Upload & Generate QR Code"}
        </Button>
      </div>

      {/* Loading Card */}
      {loading && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Processing document...</p>
                <p className="text-xs text-gray-500">
                  Generating QR code and preparing document
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}
