"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface EditUserRolesModalProps {
  userID: any;
  initialRolesCSV: any;
  updateRoles: any;
  loading: boolean;
  setRefresh: any;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function EditUserRolesModal({
  userID,
  initialRolesCSV,
  updateRoles,
  loading,
  setRefresh,
  open,
  setOpen,
}: EditUserRolesModalProps) {
  const parseRoles = (csv: string) =>
    csv
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r);

  const allRoles = ["CanRead", "CanWrite", "CanDelete", "Admin"];

  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    parseRoles(initialRolesCSV)
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!open) {
      setServerError(null);
      setServerSuccess(false);
      setSelectedRoles(parseRoles(initialRolesCSV));
    }
  }, [open, initialRolesCSV]);

  const toggleRole = (role: string) => {
    setServerError(null);
    setServerSuccess(false);
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setServerSuccess(false);

    const newRolesCSV = selectedRoles.join(",");
    try {
      const res = await updateRoles({ userID, rolesCSV: newRolesCSV });
      if (res.statusCode === 200) {
        setServerSuccess(true);
        setRefresh(Date.now());
        setOpen(false);
      } else {
        setServerError(res.errorMessage || "Failed to update roles.");
      }
    } catch (ex: any) {
      setServerError(ex?.message || "An unexpected error occurred.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Roles for User #{userID}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          {serverSuccess && (
            <p className="text-sm text-green-600">
              Roles updated successfully!
            </p>
          )}

          <div className="flex flex-col gap-3">
            {allRoles.map((role) => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role}`}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={() => toggleRole(role)}
                />
                <Label htmlFor={`role-${role}`}>{role}</Label>
              </div>
            ))}
            {selectedRoles.length === 0 && (
              <p className="text-xs text-gray-500">No roles selected</p>
            )}
          </div>

          <DialogFooter className="pt-4 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Roles"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
