"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateUserModalProps {
  create: (payload: {
    userName: string;
    email: string;
    employeeFirstName: string;
    employeeSecondName: string;
    employeeThirdName: string;
    employeeFourthName: string;
    idNumber: string;
    idDate: string;
    password: string;
  }) => Promise<{ status: number; errorMessage?: string }>;
  loading: boolean;
  setRefresh: any;
}

export function CreateUserModal({
  create,
  loading,
  setRefresh,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    employeeFirstName: "",
    employeeSecondName: "",
    employeeThirdName: "",
    employeeFourthName: "",
    idNumber: "",
    idDate: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isFormTouched, setIsFormTouched] = useState(false);

  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<boolean>(false);

  const passwordRegex = /^(?=.{8,})(?=.*[A-Z])(?=.*[!@#$%^&*(),.?:{}|<>]).*$/;

  useEffect(() => {
    if (!formData.password) {
      setPasswordError(null);
      return;
    }
    if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        "Must be ≥8 characters, include an uppercase letter and a special symbol."
      );
    } else {
      setPasswordError(null);
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsFormTouched(true);
    setServerError(null);
    setServerSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormTouched(true);
    setServerError(null);
    setServerSuccess(false);

    // If password fails client‐side regex, bail out
    if (passwordError) {
      return;
    }

    const {
      userName,
      email,
      employeeFirstName,
      employeeSecondName,
      employeeThirdName,
      employeeFourthName,
      idNumber,
      idDate,
      password,
    } = formData;

    if (
      !userName ||
      !email ||
      !employeeFirstName ||
      !employeeSecondName ||
      !employeeThirdName ||
      !employeeFourthName ||
      !idNumber ||
      !idDate ||
      !password
    ) {
      return;
    }

    let res: any;
    try {
      res = await create({
        userName,
        email,
        employeeFirstName,
        employeeSecondName,
        employeeThirdName,
        employeeFourthName,
        idNumber,
        idDate,
        password,
      });
    } catch (ex: any) {
      setServerError(ex?.message || "An unexpected error occurred.");
      return;
    }

    if (res.statusCode === 200) {
      setServerSuccess(true);
      setFormData({
        userName: "",
        email: "",
        employeeFirstName: "",
        employeeSecondName: "",
        employeeThirdName: "",
        employeeFourthName: "",
        idNumber: "",
        idDate: "",
        password: "",
      });
      setRefresh(Date.now());
    } else {
      setServerError(res.errorMessage || "Failed to create user.");
    }
  };

  const isSubmitDisabled =
    loading ||
    !!passwordError ||
    !formData.userName ||
    !formData.email ||
    !formData.employeeFirstName ||
    !formData.employeeSecondName ||
    !formData.employeeThirdName ||
    !formData.employeeFourthName ||
    !formData.idNumber ||
    !formData.idDate ||
    !formData.password;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          {/* Server‐side feedback area */}
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          {serverSuccess && (
            <p className="text-sm text-green-600">User created successfully!</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                required
              />
            </div>

            {/* Employee First Name */}
            <div className="space-y-2">
              <Label htmlFor="employeeFirstName">Employee First Name</Label>
              <Input
                id="employeeFirstName"
                name="employeeFirstName"
                value={formData.employeeFirstName}
                onChange={handleChange}
                placeholder="First name"
                required
              />
            </div>

            {/* Employee Second Name */}
            <div className="space-y-2">
              <Label htmlFor="employeeSecondName">Employee Second Name</Label>
              <Input
                id="employeeSecondName"
                name="employeeSecondName"
                value={formData.employeeSecondName}
                onChange={handleChange}
                placeholder="Second name"
                required
              />
            </div>

            {/* Employee Third Name */}
            <div className="space-y-2">
              <Label htmlFor="employeeThirdName">Employee Third Name</Label>
              <Input
                id="employeeThirdName"
                name="employeeThirdName"
                value={formData.employeeThirdName}
                onChange={handleChange}
                placeholder="Third name"
                required
              />
            </div>

            {/* Employee Fourth Name */}
            <div className="space-y-2">
              <Label htmlFor="employeeFourthName">Employee Fourth Name</Label>
              <Input
                id="employeeFourthName"
                name="employeeFourthName"
                value={formData.employeeFourthName}
                onChange={handleChange}
                placeholder="Fourth name"
                required
              />
            </div>

            {/* ID Number */}
            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="Enter ID number"
                required
              />
            </div>

            {/* ID Date */}
            <div className="space-y-2">
              <Label htmlFor="idDate">ID Date</Label>
              <Input
                id="idDate"
                name="idDate"
                type="date"
                value={formData.idDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
              {isFormTouched && passwordError && (
                <p className="text-xs text-red-600">{passwordError}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  userName: "",
                  email: "",
                  employeeFirstName: "",
                  employeeSecondName: "",
                  employeeThirdName: "",
                  employeeFourthName: "",
                  idNumber: "",
                  idDate: "",
                  password: "",
                });
                setServerError(null);
                setServerSuccess(false);
              }}
              disabled={loading}
            >
              Clear
            </Button>
            <Button type="submit" disabled={isSubmitDisabled}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
