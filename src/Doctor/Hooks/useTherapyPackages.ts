// src/Doctor/Hooks/useTherapyPackages.ts
import { useGetTherapyPackagesQuery, useCreateTherapyPackageMutation } from '../apis/doctorApi';
import { TherapyPackage } from '../types/doctor.types';

export function useTherapyPackages() {
  const { data: packages = [], isLoading, refetch } = useGetTherapyPackagesQuery();
  const [createPackageMutation, { isLoading: isCreating }] = useCreateTherapyPackageMutation();

  const getRecommendedPackages = (
    diagnosis?: string,
    dominantDosha?: string
  ): TherapyPackage[] => {
    if (!packages.length) return [];

    return packages
      .map((pkg) => {
        let score = 50;
        if (dominantDosha && pkg.targetDosha.toLowerCase().includes(dominantDosha.toLowerCase())) {
          score += 40;
        }
        if (diagnosis && pkg.description.toLowerCase().includes(diagnosis.toLowerCase().slice(0, 5))) {
          score += 30;
        }
        return { ...pkg, matchScore: score };
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  };

  const checkSimilarity = (name: string, targetDosha: string): TherapyPackage | null => {
    const normalizedName = name.toLowerCase().trim();
    return (
      packages.find((p) => {
        const pName = p.name.toLowerCase();
        return (
          (pName.includes(normalizedName) || normalizedName.includes(pName)) &&
          p.targetDosha.toLowerCase() === targetDosha.toLowerCase()
        );
      }) || null
    );
  };

  const createPackage = async (pkgData: Partial<TherapyPackage>) => {
    const created = await createPackageMutation(pkgData).unwrap();
    return created;
  };

  return {
    packages,
    isLoading,
    isCreating,
    getRecommendedPackages,
    checkSimilarity,
    createPackage,
    refetch,
  };
}
