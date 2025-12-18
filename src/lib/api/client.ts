import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Types
export interface CollectRequest {
  repository_url: string;
  platform: 'github' | 'gitlab';
  branch?: string;
}

export interface PredictionInput {
  class_name: string;
  repository_id: string;
  features: Record<string, number>;
}

export interface BatchPredictionInput {
  repository_id: string;
  classes: Array<{
    class_name: string;
    features: Record<string, number>;
  }>;
}

export interface PrioritizationRequest {
  repository_id: string;
  sprint_id?: string;
  constraints?: {
    budget_hours?: number;
    target_coverage?: number;
  };
  strategy?: string;
}

export interface TestGenOptions {
  include_mockito?: boolean;
  include_assertions?: boolean;
  test_style?: 'junit5' | 'junit4';
}

export interface PrioritizedClass {
  class_name: string;
  priority: number;
  risk_score: number;
  effort_hours: number;
  effort_aware_score: number;
  module_criticality: 'high' | 'medium' | 'low';
  strategy: string;
  reason: string;
}

export interface PrioritizationMetrics {
  total_effort_hours: number;
  estimated_coverage_gain: number;
  popt20_score: number;
  recall_top20: number;
}

export interface PrioritizationResponse {
  prioritized_plan: PrioritizedClass[];
  metrics: PrioritizationMetrics;
}

export interface PredictionOutput {
  class_name: string;
  risk_score: number;
  risk_level: 'high' | 'medium' | 'low';
  prediction: number;
  uncertainty: number;
  shap_values: Record<string, number> | null;
  explanation: string;
}

export interface TestSuggestion {
  type: 'equivalence' | 'boundary' | 'null' | 'exception';
  description: string;
  test_name: string;
  parameters: Record<string, string>;
  expected_result: string | null;
  priority: number;
  category: string;
}

export interface MethodSuggestion {
  method_name: string;
  suggestions: TestSuggestion[];
  total_count: number;
}

export interface CoverageSummary {
  commitSha: string;
  totalClasses: number;
  averageLineCoverage: number;
  averageBranchCoverage: number;
  averageMutationScore: number;
  totalLines: number;
  coveredLines: number;
}

export interface ServiceHealth {
  status: string;
  service?: string;
  version?: string;
  model_loaded?: boolean;
  num_features?: number;
}

export interface CollectionStatus {
  status: string;
  services: {
    github: boolean;
    gitlab: boolean;
    jira: boolean;
    kafka: boolean;
    database: boolean;
    minio: boolean;
  };
}

export interface TestGenerationResponse {
  test_code: string;
  test_class_name: string;
  test_package: string;
  analysis: {
    class_name: string;
    package_name: string;
    full_qualified_name: string;
    is_abstract: boolean;
    is_interface: boolean;
    methods: Array<{
      name: string;
      return_type: string | null;
      parameters: Array<{ name: string; type: string }>;
    }>;
    constructors: Array<{
      parameters: Array<{ name: string; type: string }>;
    }>;
    fields: Array<{ name: string; type: string }>;
    imports: string[];
  };
}

export interface TestSuggestionsResponse {
  class_name: string;
  method_suggestions: MethodSuggestion[];
  total_suggestions: number;
  coverage_estimate: number;
}

// API endpoints
export const api = {
  // S1 - Collection
  getCollectionStatus: () => 
    apiClient.get<CollectionStatus>('/api/s1/api/v1/collect/status'),
  triggerCollection: (data: CollectRequest) => 
    apiClient.post('/api/s1/api/v1/collect', data),
  
  // S3 - Test History
  getCoverageSummary: (commitSha: string) => 
    apiClient.get<CoverageSummary>(`/api/s3/api/coverage/commit/${commitSha}`),
  getTestSummary: (commitSha: string) => 
    apiClient.get(`/api/s3/api/tests/commit/${commitSha}`),
  
  // S5 - ML Service
  getFeatures: () => 
    apiClient.get<{ features: string[]; count: number }>('/api/s5/features'),
  predict: (data: PredictionInput) => 
    apiClient.post<PredictionOutput>('/api/s5/predict', data),
  predictBatch: (data: BatchPredictionInput) => 
    apiClient.post<PredictionOutput[]>('/api/s5/predict/batch', data),
  
  // S6 - Prioritization
  getPrioritization: (repoId: string, strategy?: string) => 
    apiClient.get<PrioritizationResponse>(`/api/s6/prioritize/${repoId}`, { params: { strategy } }),
  createPrioritization: (data: PrioritizationRequest) => 
    apiClient.post<PrioritizationResponse>('/api/s6/prioritize', data),
  
  // S7 - Test Scaffolder
  analyzeClass: (javaCode: string) => 
    apiClient.post<TestGenerationResponse['analysis']>('/api/s7/analyze', { java_code: javaCode }),
  generateTest: (javaCode: string, options?: TestGenOptions) => 
    apiClient.post<TestGenerationResponse>('/api/s7/generate-test', { java_code: javaCode, ...options }),
  suggestTestCases: (javaCode: string) => 
    apiClient.post<TestSuggestionsResponse>('/api/s7/suggest-test-cases', { java_code: javaCode }),
  getMutationChecklist: (javaCode: string) => 
    apiClient.post('/api/s7/mutation-checklist', { java_code: javaCode }),
  
  // Health
  checkHealth: (service: string) => 
    apiClient.get<ServiceHealth>(`/health/${service}`),
  
  // Health checks for all services
  checkAllHealth: async () => {
    const services = ['s1', 's5', 's6', 's7'];
    const results: Record<string, ServiceHealth | null> = {};
    
    await Promise.all(
      services.map(async (service) => {
        try {
          const response = await apiClient.get<ServiceHealth>(`/api/${service}/health`);
          results[service] = response.data;
        } catch {
          results[service] = null;
        }
      })
    );
    
    return results;
  }
};

export default api;
