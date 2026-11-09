export type WorkspaceId = 'cmd' | 'vault' | 'dossier' | 'network';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export type SystemPillarId = 
  | 'systems_philosophy'
  | 'fullstack_architecture'
  | 'vibe_coding'
  | 'hardware_mechanics';

export interface PillarNode {
  id: SystemPillarId;
  index: string;
  label: string;
  labelAr: string;
  tagline: string;
  taglineAr: string;
  coordinates: { x: number; y: number };
  complexityScore: string;
  primaryStack: string[];
  latencyBenchmark: string;
  targetAudience: string;
  artifactSlug: string;
  description: string;
  descriptionAr: string;
  connectedTo: SystemPillarId[];
}

export type ComplexityLevel = 
  | 'all'
  | 'vibe_primer'
  | 'fullstack_arch'
  | 'systems_design'
  | 'silicon_limits';

export interface VaultSnippet {
  id: string;
  timestamp: string;
  file: string;
  title: string;
  titleAr: string;
  complexity: ComplexityLevel;
  language: string;
  code: string;
  takeaway: string;
  takeawayAr: string;
}

export interface DossierBenchmark {
  metric: string;
  metricAr: string;
  baseline: string;
  petabyteResult: string;
  delta: string;
}

export interface DossierCaseStudy {
  id: string;
  index: string;
  title: string;
  titleAr: string;
  targetCommittee: string;
  leadResearchArea: string;
  problemStatement: string;
  problemStatementAr: string;
  systemSolution: string;
  systemSolutionAr: string;
  benchmarks: DossierBenchmark[];
  architectureDiagramType: string;
  status: 'DESIGN_STUDY' | 'MEASURED';
}

export interface RoadmapItem {
  id: string;
  kind: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETE';
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  deliverables: string[];
  deliverablesAr: string[];
  resultsStatus: 'PENDING' | 'PUBLISHED';
}
