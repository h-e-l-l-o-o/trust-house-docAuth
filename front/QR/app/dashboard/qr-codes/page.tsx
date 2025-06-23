"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, Download, Eye, Copy, Check, ExternalLink, QrCode } from "lucide-react"

interface QRCodeData {
  id: string
  documentNumber: string
  documentType: string
  qrCode: string
  publicUrl: string
  status: "active" | "expired"
}

export default function QRCodesPage() {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([])
  const [filteredQrCodes, setFilteredQrCodes] = useState<QRCodeData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const mockQrCodes: QRCodeData[] = [
      {
        id: "1",
        documentNumber: "DOC-2024-001",
        documentType: "Insurance Policy",
        qrCode: "QR123456",
        publicUrl: `${window.location.origin}/public/document/QR123456`,
        status: "active",
      },
      {
        id: "2",
        documentNumber: "DOC-2024-002",
        documentType: "Certificate",
        qrCode: "QR789012",
        publicUrl: `${window.location.origin}/public/document/QR789012`,
        status: "expired",
      },
      {
        id: "3",
        documentNumber: "DOC-2024-003",
        documentType: "Contract",
        qrCode: "QR345678",
        publicUrl: `${window.location.origin}/public/document/QR345678`,
        status: "expired",
      },
    ]
    setQrCodes(mockQrCodes)
    setFilteredQrCodes(mockQrCodes)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = qrCodes.filter(
        (qr) =>
          qr.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          qr.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          qr.qrCode.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredQrCodes(filtered)
    } else {
      setFilteredQrCodes(qrCodes)
    }
  }, [qrCodes, searchTerm])

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const generateQRCodeDataURL = (text: string) => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="white"/>
        <rect x="10" y="10" width="100" height="100" fill="black"/>
        <rect x="20" y="20" width="80" height="80" fill="white"/>
        <text x="60" y="65" textAnchor="middle" fontFamily="Arial" fontSize="8" fill="black">QR Code</text>
      </svg>
    `)}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">QR Codes</h1>
            <p className="text-sm text-muted-foreground">Manage and track your document QR codes</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Management</CardTitle>
            <CardDescription>
              View and manage QR codes for all your documents. Track scans and access public links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search QR codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredQrCodes.map((qrData) => (
                <Card key={qrData.id} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{qrData.documentNumber}</CardTitle>
                        <CardDescription>{qrData.documentType}</CardDescription>
                      </div>
                      {getStatusBadge(qrData.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <img
                        src={generateQRCodeDataURL(qrData.publicUrl) || "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"}
                        alt={`QR Code for ${qrData.documentNumber}`}
                        className="w-32 h-32 border rounded-lg"
                      />
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">QR Code:</span>
                        <span className="font-mono">{qrData.qrCode}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Public URL:</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={qrData.publicUrl}
                          readOnly
                          className="flex-1 px-2 py-1 text-xs border rounded bg-gray-50 truncate"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(qrData.publicUrl, qrData.id)}
                        >
                          {copiedId === qrData.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(qrData.publicUrl, "_blank")}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredQrCodes.length === 0 && (
              <div className="text-center py-12">
                <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes found</h3>
                <p className="text-gray-600">
                  {searchTerm ? "Try adjusting your search terms." : "Upload documents to generate QR codes."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
