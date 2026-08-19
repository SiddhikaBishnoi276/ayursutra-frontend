import type { TherapyPackage, StageCategory } from '../types/admin.types';

interface PackageTemplateCardProps {
    package: TherapyPackage;
}

const categoryColors: Record<StageCategory, string> = {
    Poorvakarma: 'bg-blue-100 text-blue-700',
    Pradhanakarma: 'bg-orange-100 text-orange-700',
    Paschatkarma: 'bg-green-100 text-green-700',
};

export const PackageTemplateCard = ({ package: pkg }: PackageTemplateCardProps) => {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-5 shadow-sm">
            <div>
                <h3 className="text-base font-semibold text-slate-800">{pkg.name}</h3>
                <p className="text-sm text-slate-500">{pkg.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {pkg.stages.map((stage, idx) => (
                    <div key={stage.id} className="flex items-center gap-2">
                        <div
                            className={`flex flex-col items-center rounded-lg px-3 py-2 text-xs font-medium ${categoryColors[stage.stageCategory]}`}
                        >
                            <span>{stage.stageName}</span>
                            <span className="opacity-70">Day {stage.dayOffset}</span>
                        </div>
                        {idx < pkg.stages.length - 1 && (
                            <span className="text-slate-300">→</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};