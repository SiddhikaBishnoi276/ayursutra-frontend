// src/admin/hooks/useProtocols.ts
import { useState, useEffect } from 'react';
import { useGetPackagesQuery, useCreatePackageMutation } from '../apis/adminApi';
import { TherapyPackage, PackageStage } from '../types/admin.types';

export const useProtocols = () => {
  const { data: initialPackages = [], isLoading } = useGetPackagesQuery();
  const [createPackageMutation] = useCreatePackageMutation();

  const [packageList, setPackageList] = useState<TherapyPackage[]>([]);

  useEffect(() => {
    if (initialPackages.length > 0 && packageList.length === 0) {
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
    } catch {
      // Local state ready
    }
    return newPkg;
  };

  const editPackage = (updatedPkg: TherapyPackage) => {
    setPackageList((prev) =>
      prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p))
    );
  };

  const approvePackage = (id: string) => {
    setPackageList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Active' as const } : p))
    );
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
