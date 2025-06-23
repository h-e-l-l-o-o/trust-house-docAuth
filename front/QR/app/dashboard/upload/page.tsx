"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { DocumentUploadForm } from "@/components/document-upload-form"
import { useAuthContext } from "@/context/AuthProvider"
import useDocType from "@/hooks/useDocType"
import useDoc from "@/hooks/useDoc"


export default function UploadPage() {
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadedDocument, setUploadedDocument] = useState<Document | null>(null)
  const {jwt, fetchNewJwt} = useAuthContext()
  const { docTypes } = useDocType(jwt, fetchNewJwt)
  const { createDoc, docLoading } = useDoc(jwt, fetchNewJwt, 0)

  const handleUploadAnother = () => {
    setUploadSuccess(false)
    setUploadedDocument(null)
  }

  if (uploadSuccess && uploadedDocument) {
    return (
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Upload Successful</h1>
              <p className="text-sm text-muted-foreground">Document uploaded and QR code generated</p>
            </div>
          </div>
        </header>

        {/* Success Content */}
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Uploaded Successfully!</h2>
                <p className="text-gray-600 mb-6">Your document has been processed and a QR code has been generated.</p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold mb-3">Document Details:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Document Number:</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                    </div>
                    <div className="flex justify-between">
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleUploadAnother}>Upload Another Document</Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/documents">View All Documents</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard">Back to Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Upload Document</h1>
            <p className="text-sm text-muted-foreground">Upload a new document and generate QR code</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>
                Upload your document and enter the required metadata. A QR code will be automatically generated for
                authentication.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUploadForm create={createDoc} loading={docLoading} docTypes={docTypes}/>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upload Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Supported File Types</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• PDF documents (.pdf)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">File Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Maximum file size: 100MB</li>
                    <li>• Clear, readable content</li>
                    <li>• Valid document format</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Document Information</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Document number (auto-generated or custom)</li>
                    <li>• Document type selection</li>
                    <li>• Issue and expiry dates</li>
                  </ul>
                </div>string
                <div>
                  <h4 className="font-semibold mb-2">QR Code Generation</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Automatic QR code creation</li>
                    <li>• Secure encrypted URL</li>
                    <li>• Public verification link</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
