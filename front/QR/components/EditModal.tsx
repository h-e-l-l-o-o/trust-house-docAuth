"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

export function EditModal({
  id,
  isOpen,
  setOpen,
  upload, // async function that sends the FormData to your API
  loading, // boolean “is saving…” flag
  setRefresh, // callback to tell parent to refresh its list
}: {
  id: number | string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  upload: (
    body: FormData
  ) => Promise<{ statusCode: number; errorMessage?: string }>;
  loading: boolean;
  setRefresh: any;
}) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    // Build FormData
    const body = new FormData();
    // — send the ID as a string (some servers expect string)
    body.append("DocID", id.toString());
    // — use lowercase "file" unless your API specifically wants "File"
    body.append("file", file);

    // — debugging: log each key/value so you can inspect in DevTools
    for (const pair of Array.from(body.entries())) {
      console.log("FormData entry:", pair[0], pair[1]);
    }

    try {
      // IMPORTANT: do NOT set Content-Type yourself. Let the browser do it.
      const res = await upload(body);

      if (res.statusCode === 200) {
        // success → tell parent to refresh and close
        setRefresh(Date.now());
        setOpen(false);
      } else {
        console.error("Upload failed:", res.errorMessage);
      }
    } catch (err) {
      console.error("Upload threw an exception:", err);
    }
  };

  const handleClose = () => {
    // Reset file so next open starts fresh
    setFile(null);
    setOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Upload New File</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file-input">Select PDF</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                required
                disabled={loading}
              />
              <label
                htmlFor="file-input"
                className={`cursor-pointer ${
                  loading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">PDF up to 100MB</p>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !file}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="p-6 border-t">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Uploading file…</p>
                    <p className="text-xs text-gray-500">
                      Please wait while we process your file.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
