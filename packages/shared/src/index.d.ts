import { z } from 'zod';
export declare enum UserRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    ANALYST = "ANALYST",
    VIEWER = "VIEWER"
}
export declare enum WorkspaceMemberRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    VIEWER = "VIEWER"
}
export declare enum DocumentCategory {
    CONTRACT = "CONTRACT",
    LEGAL_BRIEF = "LEGAL_BRIEF",
    COMPLIANCE = "COMPLIANCE",
    PATENT = "PATENT",
    LITIGATION = "LITIGATION",
    OTHER = "OTHER"
}
export declare enum ChatMessageType {
    USER = "USER",
    ASSISTANT = "ASSISTANT",
    SYSTEM = "SYSTEM"
}
export declare enum UserActivityType {
    DOCUMENT_UPLOAD = "DOCUMENT_UPLOAD",
    DOCUMENT_VIEW = "DOCUMENT_VIEW",
    DOCUMENT_ANALYZE = "DOCUMENT_ANALYZE",
    CHAT_SESSION = "CHAT_SESSION",
    DOCUMENT_COMPARE = "DOCUMENT_COMPARE",
    WORKSPACE_JOIN = "WORKSPACE_JOIN",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT"
}
export declare enum AnnotationType {
    HIGHLIGHT = "HIGHLIGHT",
    NOTE = "NOTE",
    QUESTION = "QUESTION",
    IMPORTANT = "IMPORTANT"
}
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodNativeEnum<typeof UserRole>;
    preferences: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    password: string;
    id: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    preferences?: Record<string, any> | undefined;
}, {
    password: string;
    id: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    preferences?: Record<string, any> | undefined;
}>;
export declare const PublicUserSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodNativeEnum<typeof UserRole>;
    preferences: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "password">, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    preferences?: Record<string, any> | undefined;
}, {
    id: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    preferences?: Record<string, any> | undefined;
}>;
export declare const CreateUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodNativeEnum<typeof UserRole>>;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    role: UserRole;
}, {
    password: string;
    email: string;
    role?: UserRole | undefined;
}>;
export declare const UpdateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodNativeEnum<typeof UserRole>>;
    preferences: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    role?: UserRole | undefined;
    preferences?: Record<string, any> | undefined;
}, {
    email?: string | undefined;
    role?: UserRole | undefined;
    preferences?: Record<string, any> | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
}, {
    password: string;
    email: string;
}>;
export declare const RegisterSchema: z.ZodEffects<z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    confirmPassword: string;
}, {
    password: string;
    email: string;
    confirmPassword: string;
}>, {
    password: string;
    email: string;
    confirmPassword: string;
}, {
    password: string;
    email: string;
    confirmPassword: string;
}>;
export declare const WorkspaceSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    ownerId: z.ZodString;
    settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    settings?: Record<string, any> | undefined;
}, {
    id: string;
    name: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    settings?: Record<string, any> | undefined;
}>;
export declare const CreateWorkspaceSchema: z.ZodObject<{
    name: z.ZodString;
    settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    settings?: Record<string, any> | undefined;
}, {
    name: string;
    settings?: Record<string, any> | undefined;
}>;
export declare const UpdateWorkspaceSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    settings?: Record<string, any> | undefined;
}, {
    name?: string | undefined;
    settings?: Record<string, any> | undefined;
}>;
export declare const DocumentSchema: z.ZodObject<{
    id: z.ZodString;
    workspaceId: z.ZodString;
    uploadedById: z.ZodString;
    title: z.ZodString;
    originalName: z.ZodString;
    mimeType: z.ZodString;
    category: z.ZodOptional<z.ZodNativeEnum<typeof DocumentCategory>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    content: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    confidenceScore: z.ZodOptional<z.ZodNumber>;
    processingTime: z.ZodOptional<z.ZodNumber>;
    hash: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    workspaceId: string;
    hash: string;
    mimeType: string;
    createdAt: Date;
    originalName: string;
    title: string;
    updatedAt: Date;
    uploadedById: string;
    metadata?: Record<string, any> | undefined;
    category?: DocumentCategory | undefined;
    content?: string | undefined;
    tags?: string[] | undefined;
    processingTime?: number | undefined;
    confidenceScore?: number | undefined;
}, {
    id: string;
    workspaceId: string;
    hash: string;
    mimeType: string;
    createdAt: Date;
    originalName: string;
    title: string;
    updatedAt: Date;
    uploadedById: string;
    metadata?: Record<string, any> | undefined;
    category?: DocumentCategory | undefined;
    content?: string | undefined;
    tags?: string[] | undefined;
    processingTime?: number | undefined;
    confidenceScore?: number | undefined;
}>;
export declare const CreateDocumentSchema: z.ZodObject<{
    workspaceId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodNativeEnum<typeof DocumentCategory>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    workspaceId: string;
    category?: DocumentCategory | undefined;
    title?: string | undefined;
    tags?: string[] | undefined;
}, {
    workspaceId: string;
    category?: DocumentCategory | undefined;
    title?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const UpdateDocumentSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodNativeEnum<typeof DocumentCategory>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    metadata?: Record<string, any> | undefined;
    category?: DocumentCategory | undefined;
    title?: string | undefined;
    tags?: string[] | undefined;
}, {
    metadata?: Record<string, any> | undefined;
    category?: DocumentCategory | undefined;
    title?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const ChatSessionSchema: z.ZodObject<{
    id: z.ZodString;
    documentId: z.ZodString;
    userId: z.ZodString;
    title: z.ZodString;
    context: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    userId: string;
    title: string;
    updatedAt: Date;
    documentId: string;
    context?: Record<string, any> | undefined;
}, {
    id: string;
    createdAt: Date;
    userId: string;
    title: string;
    updatedAt: Date;
    documentId: string;
    context?: Record<string, any> | undefined;
}>;
export declare const CreateChatSessionSchema: z.ZodObject<{
    documentId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    documentId: string;
    title?: string | undefined;
}, {
    documentId: string;
    title?: string | undefined;
}>;
export declare const ChatMessageSchema: z.ZodObject<{
    id: z.ZodString;
    sessionId: z.ZodString;
    type: z.ZodNativeEnum<typeof ChatMessageType>;
    content: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    citations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        pageNumber: z.ZodOptional<z.ZodNumber>;
        text: z.ZodString;
        confidence: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        confidence?: number | undefined;
        pageNumber?: number | undefined;
    }, {
        text: string;
        confidence?: number | undefined;
        pageNumber?: number | undefined;
    }>, "many">>;
    confidenceScore: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    type: ChatMessageType;
    id: string;
    createdAt: Date;
    content: string;
    sessionId: string;
    metadata?: Record<string, any> | undefined;
    citations?: {
        text: string;
        confidence?: number | undefined;
        pageNumber?: number | undefined;
    }[] | undefined;
    confidenceScore?: number | undefined;
}, {
    type: ChatMessageType;
    id: string;
    createdAt: Date;
    content: string;
    sessionId: string;
    metadata?: Record<string, any> | undefined;
    citations?: {
        text: string;
        confidence?: number | undefined;
        pageNumber?: number | undefined;
    }[] | undefined;
    confidenceScore?: number | undefined;
}>;
export declare const CreateChatMessageSchema: z.ZodObject<{
    sessionId: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    sessionId: string;
}, {
    content: string;
    sessionId: string;
}>;
export declare const DocumentComparisonSchema: z.ZodObject<{
    id: z.ZodString;
    doc1Id: z.ZodString;
    doc2Id: z.ZodString;
    results: z.ZodObject<{
        similarityScore: z.ZodNumber;
        differences: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["added", "removed", "modified"]>;
            text: z.ZodString;
            position: z.ZodObject<{
                start: z.ZodNumber;
                end: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                end: number;
                start: number;
            }, {
                end: number;
                start: number;
            }>;
            similarity: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            type: "added" | "removed" | "modified";
            text: string;
            position: {
                end: number;
                start: number;
            };
            similarity?: number | undefined;
        }, {
            type: "added" | "removed" | "modified";
            text: string;
            position: {
                end: number;
                start: number;
            };
            similarity?: number | undefined;
        }>, "many">;
        commonClauses: z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            similarity: z.ZodNumber;
            doc1Position: z.ZodObject<{
                start: z.ZodNumber;
                end: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                end: number;
                start: number;
            }, {
                end: number;
                start: number;
            }>;
            doc2Position: z.ZodObject<{
                start: z.ZodNumber;
                end: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                end: number;
                start: number;
            }, {
                end: number;
                start: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            text: string;
            similarity: number;
            doc1Position: {
                end: number;
                start: number;
            };
            doc2Position: {
                end: number;
                start: number;
            };
        }, {
            text: string;
            similarity: number;
            doc1Position: {
                end: number;
                start: number;
            };
            doc2Position: {
                end: number;
                start: number;
            };
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        similarityScore: number;
        differences: {
            type: "added" | "removed" | "modified";
            text: string;
            position: {
                end: number;
                start: number;
            };
            similarity?: number | undefined;
        }[];
        commonClauses: {
            text: string;
            similarity: number;
            doc1Position: {
                end: number;
                start: number;
            };
            doc2Position: {
                end: number;
                start: number;
            };
        }[];
    }, {
        similarityScore: number;
        differences: {
            type: "added" | "removed" | "modified";
            text: string;
            position: {
                end: number;
                start: number;
            };
            similarity?: number | undefined;
        }[];
        commonClauses: {
            text: string;
            similarity: number;
            doc1Position: {
                end: number;
                start: number;
            };
            doc2Position: {
                end: number;
                start: number;
            };
        }[];
    }>;
    similarityScore: z.ZodNumber;
    performedById: z.ZodString;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    doc2Id: string;
    doc1Id: string;
    performedById: string;
    results: {
        similarityScore: number;
        differences: {
            type: "added" | "removed" | "modified";
            text: string;
            position: {
                end: number;
                start: number;
            };
            similarity?: number | undefined;
        }[];
        commonClauses: {
            text: string;
            similarity: number;
            doc1Position: {
                end: number;
                start: number;
            };
            doc2Position: {
                end: number;
                start: number;
            };
        }[];
    };
    similarityScore: number;
}, {
    id: string;
    createdAt: Date;
    doc2Id: string;
    doc1Id: string;
    performedById: string;
    results: {
        similarityScore: number;
        differences: {
            type: "added" | "removed" | "modified";
            text: string;
            position: {
                end: number;
                start: number;
            };
            similarity?: number | undefined;
        }[];
        commonClauses: {
            text: string;
            similarity: number;
            doc1Position: {
                end: number;
                start: number;
            };
            doc2Position: {
                end: number;
                start: number;
            };
        }[];
    };
    similarityScore: number;
}>;
export declare const CreateComparisonSchema: z.ZodObject<{
    doc1Id: z.ZodString;
    doc2Id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    doc2Id: string;
    doc1Id: string;
}, {
    doc2Id: string;
    doc1Id: string;
}>;
export declare const AnalyticsMetricsSchema: z.ZodObject<{
    totalDocuments: z.ZodNumber;
    totalUsers: z.ZodNumber;
    totalWorkspaces: z.ZodNumber;
    documentsThisMonth: z.ZodNumber;
    activeUsersThisMonth: z.ZodNumber;
    averageProcessingTime: z.ZodNumber;
    storageUsed: z.ZodNumber;
    apiCallsThisMonth: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    totalDocuments: number;
    totalUsers: number;
    totalWorkspaces: number;
    documentsThisMonth: number;
    activeUsersThisMonth: number;
    apiCallsThisMonth: number;
    averageProcessingTime: number;
    storageUsed: number;
}, {
    totalDocuments: number;
    totalUsers: number;
    totalWorkspaces: number;
    documentsThisMonth: number;
    activeUsersThisMonth: number;
    apiCallsThisMonth: number;
    averageProcessingTime: number;
    storageUsed: number;
}>;
export type User = z.infer<typeof UserSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type Workspace = z.infer<typeof WorkspaceSchema>;
export type CreateWorkspace = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspace = z.infer<typeof UpdateWorkspaceSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type CreateDocument = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocument = z.infer<typeof UpdateDocumentSchema>;
export type ChatSession = z.infer<typeof ChatSessionSchema>;
export type CreateChatSession = z.infer<typeof CreateChatSessionSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type CreateChatMessage = z.infer<typeof CreateChatMessageSchema>;
export type DocumentComparison = z.infer<typeof DocumentComparisonSchema>;
export type CreateComparison = z.infer<typeof CreateComparisonSchema>;
export type AnalyticsMetrics = z.infer<typeof AnalyticsMetricsSchema>;
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
        details?: any;
    };
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
export interface AuthResponse {
    user: Omit<User, 'password'>;
    accessToken: string;
    refreshToken: string;
}
export interface DocumentAnalysisResult {
    summary: string;
    keyPoints: string[];
    entities: Array<{
        text: string;
        type: string;
        confidence: number;
    }>;
    confidence: number;
    processingTime: number;
}
export interface DocumentUploadResult {
    document: Document;
    analysis?: DocumentAnalysisResult;
}
export interface PaginationParams {
    page?: number;
    limit?: number;
}
export interface FilterParams {
    search?: string;
    category?: DocumentCategory;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
}
export interface SortParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
//# sourceMappingURL=index.d.ts.map