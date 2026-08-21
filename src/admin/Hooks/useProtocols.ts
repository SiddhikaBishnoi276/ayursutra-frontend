// src/admin/hooks/useProtocols.ts
import { useState, useEffect } from 'react';
import { useGetPackagesQuery, useCreatePackageMutation, useUpdateProtocolMutation } from '../apis/adminApi';
import { TherapyPackage, PackageStage } from '../types/admin.types';

export const useProtocols = () => {
  const { data: initialPackages = [], isLoading, refetch } = useGetPackagesQuery();
  const [createPackageMutation] = useCreatePackageMutation();
  const [updateProtocolMutation] = useUpdateProtocolMutation();

  const [packageList, setPackageList] = useState<TherapyPackage[]>([]);

  useEffect(() => {
    if (initialPackages.length > 0) {
      setPackageList(initialPackages);
    }
  }, [initialPackages]);

  const checkSimilarity = (name: string): string | null => {
    const lower = name.toLowerCase().trim();
    if (!lower) return null;
    const match = packageList.find((p) => {
      const pLower = p.name.toLowerCase();
      return (
        pLower.includes(lower) ||
        lower.includes(pLower) ||
        (lower.includes('virechana') && pLower.includes('virechana')) ||
        (lower.includes('basti') && pLower.includes('basti')) ||
        (lower.includes('nasya') && pLower.includes('nasya')) ||
        (lower.includes('vamana') && pLower.includes('vamana')) ||
        (lower.includes('rakta') && pLower.includes('rakta'))
      );
    });
    return match ? match.name : null;
  };

  const addPackage = async (data: {
    name: string;
    therapy_type?: string;
    targetDosha?: string;
    description?: string;
    base_price?: number;
    durationDays?: number;
    stages: PackageStage[];
    preProcedureInstructions?: string;
    postProcedureInstructions?: string;
    dietFramework?: string;
    clinic_id?: number | string;
  }) => {
    const totalDays =
      data.durationDays ||
      (data.stages.length
        ? data.stages.reduce((s, st) => s + (st.durationDays || st.duration_days || 1), 0)
        : 7);

    const newPkg: TherapyPackage = {
      id: `PKG-${Date.now().toString().slice(-3)}`,
      name: data.name,
      therapy_type: data.therapy_type || data.targetDosha || 'Virechana',
      targetDosha: data.targetDosha || data.therapy_type || 'Virechana',
      description: data.description || `Classical clinical protocol for ${data.name}.`,
      base_price: data.base_price || 0,
      durationDays: totalDays,
      stages: data.stages,
      preProcedureInstructions: data.preProcedureInstructions,
      postProcedureInstructions: data.postProcedureInstructions,
      dietFramework: data.dietFramework,
      createdBy: 'admin',
      authorName: 'Clinic Administrator',
      status: 'Active',
    };

    setPackageList((prev) => [newPkg, ...prev]);

    try {
      await createPackageMutation({
        name: data.name,
        therapy_type: data.therapy_type || data.targetDosha || 'Virechana',
        targetDosha: data.targetDosha || data.therapy_type || 'Virechana',
        description: data.description,
        base_price: data.base_price,
        stages: data.stages,
        preProcedureInstructions: data.preProcedureInstructions,
        postProcedureInstructions: data.postProcedureInstructions,
        dietFramework: data.dietFramework,
        clinic_id: data.clinic_id,
      } as any).unwrap();
    } catch (err) {
      console.warn('[useProtocols] createPackage failed, using optimistic state:', err);
    }
    return newPkg;
  };

  const editPackage = async (updatedPkg: TherapyPackage) => {
    setPackageList((prev) =>
      prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p))
    );

    try {
      const rawId = updatedPkg.id.replace(/^PKG-/, '');
      await updateProtocolMutation({
        id: rawId,
        name: updatedPkg.name,
        therapy_type: updatedPkg.therapy_type || updatedPkg.targetDosha,
        description: updatedPkg.description,
        base_price: updatedPkg.base_price,
        stages: updatedPkg.stages,
      }).unwrap();
    } catch (err) {
      console.warn('[useProtocols] updateProtocol failed, kept local state:', err);
    }
  };

  const approvePackage = (id: string) => {
    setPackageList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Active' as const } : p))
    );
  };

  return {
    packages: packageList,
    isLoading,
    refetch,
    checkSimilarity,
    addPackage,
    editPackage,
    approvePackage,
  };
};

export default useProtocols;
