// State Management with Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
interface AuthState {
  user: {
    id: number;
    email: string;
    fullName: string;
  } | null;
  token: string | null;
  setAuth: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'nochill-auth',
    }
  )
);

// ============================================
// BUSINESS OS TYPES
// ============================================

export interface RevenueEntry {
  id?: number;
  date: string;
  stream: 'Products' | 'Ads' | 'Information' | 'Deals' | 'Services';
  amount: number;
  description: string;
  receipt_url?: string;
}

export interface SprintTask {
  id?: number;
  week: number;
  task_name: string;
  completed: boolean;
  due_date?: string;
  notes?: string;
  is_custom?: boolean;
}

export interface Product {
  id?: number;
  name: string;
  type: 'Course' | 'Book' | 'Micro-Product' | 'Membership' | 'Coaching' | 'Workshop' | 'Template' | 'Community';
  price: number;
  description?: string;
  status: 'Idea' | 'Planning' | 'Production' | 'Launched' | 'Evergreen';
  launch_date?: string;
  revenue_generated: number;
  units_sold: number;
}

export interface ContentItem {
  id?: number;
  platform: string;
  content_type: string;
  four_e_category: 'Entertain' | 'Educate' | 'Encourage' | 'Earn';
  title: string;
  description?: string;
  status: 'Idea' | 'Scripted' | 'Filmed' | 'Edited' | 'Scheduled' | 'Published';
  publish_date?: string;
  published_url?: string;
  performance_notes?: string;
  parent_content_id?: number;
}

export interface Student {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  stage: 'Signal' | 'Engagement' | 'Education' | 'Decision' | 'Success';
  seeds_source?: string; // Which content brought them in
  product_purchased?: string;
  revenue_contributed: number;
  tags?: string[];
  is_at_risk?: boolean;
  notes?: string;
  created_at?: string;
  last_interaction?: string;
  stage_history?: { stage: string; date: string; }[]; // Track progression through funnel
}

export interface FaithEntry {
  id?: number;
  entry_type: 'Prayer' | 'Giving' | 'Testimony' | 'Scripture' | 'Kingdom-KPI';
  date: string;
  amount?: number;
  content?: string;
  scripture_reference?: string;
  prayer_status?: 'Praying' | 'Answered' | 'Redirected';
  kpi_type?: string;
  kpi_count?: number;
}

export interface Risk {
  id?: number;
  risk_name: string;
  category: 'Financial' | 'Operational' | 'Market' | 'Platform' | 'Legal' | 'Health' | 'Reputation';
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigation_plan?: string;
  status: 'Monitoring' | 'Active' | 'Mitigated' | 'Occurred';
  last_reviewed?: string;
  review_notes?: string;
}

// ============================================
// BUSINESS OS STORE
// ============================================

interface BusinessOSState {
  // Revenue
  revenueEntries: RevenueEntry[];
  addRevenue: (entry: RevenueEntry) => void;
  setRevenue: (entries: RevenueEntry[]) => void;
  getTotalRevenue: (stream?: string) => number;

  // Sprint Tasks
  tasks: SprintTask[];
  addTask: (task: SprintTask) => void;
  setTasks: (tasks: SprintTask[]) => void;
  toggleTask: (id: number) => void;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  setProducts: (products: Product[]) => void;
  updateProductStatus: (id: number, status: Product['status']) => void;

  // Content
  contentItems: ContentItem[];
  addContent: (item: ContentItem) => void;
  setContent: (items: ContentItem[]) => void;

  // Students
  students: Student[];
  addStudent: (student: Student) => void;
  setStudents: (students: Student[]) => void;

  // Faith
  faithEntries: FaithEntry[];
  addFaithEntry: (entry: FaithEntry) => void;
  setFaithEntries: (entries: FaithEntry[]) => void;

  // Risks
  risks: Risk[];
  addRisk: (risk: Risk) => void;
  setRisks: (risks: Risk[]) => void;
  updateRisk: (id: number, updates: Partial<Risk>) => void;
}

export const useBusinessOS = create<BusinessOSState>()(
  persist(
    (set, get) => ({
      // Revenue
      revenueEntries: [],
      addRevenue: (entry) => set((state) => ({
        revenueEntries: [...state.revenueEntries, entry]
      })),
      setRevenue: (entries) => set({ revenueEntries: entries }),
      getTotalRevenue: (stream) => {
        const entries = get().revenueEntries;
        return entries
          .filter(e => !stream || e.stream === stream)
          .reduce((sum, e) => sum + e.amount, 0);
      },

      // Sprint Tasks
      tasks: [],
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
      })),
      setTasks: (tasks) => set({ tasks }),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      })),

      // Products
      products: [],
      addProduct: (product) => set((state) => ({
        products: [...state.products, product]
      })),
      setProducts: (products) => set({ products }),
      updateProductStatus: (id, status) => set((state) => ({
        products: state.products.map(p =>
          p.id === id ? { ...p, status } : p
        )
      })),

      // Content
      contentItems: [],
      addContent: (item) => set((state) => ({
        contentItems: [...state.contentItems, item]
      })),
      setContent: (items) => set({ contentItems: items }),

      // Students
      students: [],
      addStudent: (student) => set((state) => ({
        students: [...state.students, student]
      })),
      setStudents: (students) => set({ students }),

      // Faith
      faithEntries: [],
      addFaithEntry: (entry) => set((state) => ({
        faithEntries: [...state.faithEntries, entry]
      })),
      setFaithEntries: (entries) => set({ faithEntries: entries }),

      // Risks
      risks: [],
      addRisk: (risk) => set((state) => ({
        risks: [...state.risks, risk]
      })),
      setRisks: (risks) => set({ risks }),
      updateRisk: (id, updates) => set((state) => ({
        risks: state.risks.map(r =>
          r.id === id ? { ...r, ...updates } : r
        )
      })),
    }),
    {
      name: 'nochill-business-os',
    }
  )
);
