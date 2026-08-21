// src/admin/hooks/useProtocols.ts
import { useState, useEffect } from 'react';
import { useGetPackagesQuery, useCreatePackageMutation, useUpdatePackageMutation } from '../apis/adminApi';
import { TherapyPackage, PackageStage } from '../types/admin.types';

export const useProtocols = () => {
  const { data: initialPackages = [], isLoading } = useGetPackagesQuery();
  const [createPackageMutation] = useCreatePackageMutation();
  const [updatePackageMutation] = useUpdatePackageMutation();

  const [packageList, setPackageList] = useState<TherapyPackage[]>([]);

  // Synchronize state with query results
  useEffect(() => {
    if (initialPackages) {
      setPackageList(initialPackages);
    }
  }, [initialPackages]);

  const checkSimilarity = (name: string): string | null => {
    const lower = name.toLowerCase().trim();
    if (!lower) return null;
    const match = packageList.find((p) => {
      const pLower = p.name.toLowerCase();
      return pLower.includes(lower) || lower.includes(pLower) || 
        (lower.includes('virechana') && pLower.includes('virechana')) ||
        (lower.includes('basti') && pLower.includes('basti')) ||
        (lower.includes('nasya') && pLower.includes('nasya'));
    });
    return match ? match.name : null;
  };

  const addPackage = async (data: {
    name: string;
    description: string;
    targetDosha: string;
    durationDays: number;
    stages: PackageStage[];
    preProcedureInstructions?: string;
    postProcedureInstructions?: string;
    dietFramework?: string;
  }) => {
    const newPkg: TherapyPackage = {
      ...data,
      id: `PKG-${Date.now().toString().slice(-3)}`,
      createdBy: 'admin',
      authorName: 'Clinic Administrator',
      status: 'Active',
    };
    setPackageList((prev) => [newPkg, ...prev]);
    try {
      await createPackageMutation(newPkg).unwrap();
    } catch (err) {
      console.error('Failed to create package in DB:', err);
    }
    return newPkg;
  };

  const editPackage = async (updatedPkg: TherapyPackage) => {
    const original = packageList.find((p) => p.id === updatedPkg.id);

    // Optimistic update
    setPackageList((prev) =>
      prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p))
    );

    try {
      await updatePackageMutation(updatedPkg).unwrap();
    } catch (err) {
      console.error('Failed to update package in DB:', err);
      if (original) {
        setPackageList((prev) =>
          prev.map((p) => (p.id === updatedPkg.id ? original : p))
        );
      }
    }
  };

  const approvePackage = async (id: string) => {
    const original = packageList.find((p) => p.id === id);
    if (!original) return;

    const approvedPkg = { ...original, status: 'Active' as const };

    // Optimistic update
    setPackageList((prev) =>
      prev.map((p) => (p.id === id ? approvedPkg : p))
    );

    try {
      await updatePackageMutation(approvedPkg).unwrap();
    } catch (err) {
      console.error('Failed to approve package in DB:', err);
      // Revert optimistic update
      setPackageList((prev) =>
        prev.map((p) => (p.id === id ? original : p))
      );
    }
  };

  return {
    packages: packageList,
    isLoading,
    checkSimilarity,
    addPackage,
    editPackage,
    approvePackage,
  };
};

