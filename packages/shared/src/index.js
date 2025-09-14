"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsMetricsSchema = exports.CreateComparisonSchema = exports.DocumentComparisonSchema = exports.CreateChatMessageSchema = exports.ChatMessageSchema = exports.CreateChatSessionSchema = exports.ChatSessionSchema = exports.UpdateDocumentSchema = exports.CreateDocumentSchema = exports.DocumentSchema = exports.UpdateWorkspaceSchema = exports.CreateWorkspaceSchema = exports.WorkspaceSchema = exports.RegisterSchema = exports.LoginSchema = exports.UpdateUserSchema = exports.CreateUserSchema = exports.PublicUserSchema = exports.UserSchema = exports.AnnotationType = exports.UserActivityType = exports.ChatMessageType = exports.DocumentCategory = exports.WorkspaceMemberRole = exports.UserRole = void 0;
const zod_1 = require("zod");
// ===== ENUMS =====
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["ANALYST"] = "ANALYST";
    UserRole["VIEWER"] = "VIEWER";
})(UserRole || (exports.UserRole = UserRole = {}));
var WorkspaceMemberRole;
(function (WorkspaceMemberRole) {
    WorkspaceMemberRole["OWNER"] = "OWNER";
    WorkspaceMemberRole["ADMIN"] = "ADMIN";
    WorkspaceMemberRole["MEMBER"] = "MEMBER";
    WorkspaceMemberRole["VIEWER"] = "VIEWER";
})(WorkspaceMemberRole || (exports.WorkspaceMemberRole = WorkspaceMemberRole = {}));
var DocumentCategory;
(function (DocumentCategory) {
    DocumentCategory["CONTRACT"] = "CONTRACT";
    DocumentCategory["LEGAL_BRIEF"] = "LEGAL_BRIEF";
    DocumentCategory["COMPLIANCE"] = "COMPLIANCE";
    DocumentCategory["PATENT"] = "PATENT";
    DocumentCategory["LITIGATION"] = "LITIGATION";
    DocumentCategory["OTHER"] = "OTHER";
})(DocumentCategory || (exports.DocumentCategory = DocumentCategory = {}));
var ChatMessageType;
(function (ChatMessageType) {
    ChatMessageType["USER"] = "USER";
    ChatMessageType["ASSISTANT"] = "ASSISTANT";
    ChatMessageType["SYSTEM"] = "SYSTEM";
})(ChatMessageType || (exports.ChatMessageType = ChatMessageType = {}));
var UserActivityType;
(function (UserActivityType) {
    UserActivityType["DOCUMENT_UPLOAD"] = "DOCUMENT_UPLOAD";
    UserActivityType["DOCUMENT_VIEW"] = "DOCUMENT_VIEW";
    UserActivityType["DOCUMENT_ANALYZE"] = "DOCUMENT_ANALYZE";
    UserActivityType["CHAT_SESSION"] = "CHAT_SESSION";
    UserActivityType["DOCUMENT_COMPARE"] = "DOCUMENT_COMPARE";
    UserActivityType["WORKSPACE_JOIN"] = "WORKSPACE_JOIN";
    UserActivityType["LOGIN"] = "LOGIN";
    UserActivityType["LOGOUT"] = "LOGOUT";
})(UserActivityType || (exports.UserActivityType = UserActivityType = {}));
var AnnotationType;
(function (AnnotationType) {
    AnnotationType["HIGHLIGHT"] = "HIGHLIGHT";
    AnnotationType["NOTE"] = "NOTE";
    AnnotationType["QUESTION"] = "QUESTION";
    AnnotationType["IMPORTANT"] = "IMPORTANT";
})(AnnotationType || (exports.AnnotationType = AnnotationType = {}));
// ===== ZOD SCHEMAS =====
// User Schemas
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.nativeEnum(UserRole),
    preferences: zod_1.z.record(zod_1.z.any()).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
// Public User Schema (without password)
exports.PublicUserSchema = exports.UserSchema.omit({ password: true });
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.nativeEnum(UserRole).default(UserRole.ANALYST)
});
exports.UpdateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    role: zod_1.z.nativeEnum(UserRole).optional(),
    preferences: zod_1.z.record(zod_1.z.any()).optional()
});
// Auth Schemas
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1)
});
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    confirmPassword: zod_1.z.string().min(6)
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});
// Workspace Schemas
exports.WorkspaceSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    name: zod_1.z.string().min(1).max(100),
    ownerId: zod_1.z.string().cuid(),
    settings: zod_1.z.record(zod_1.z.any()).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.CreateWorkspaceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    settings: zod_1.z.record(zod_1.z.any()).optional()
});
exports.UpdateWorkspaceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    settings: zod_1.z.record(zod_1.z.any()).optional()
});
// Document Schemas
exports.DocumentSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    workspaceId: zod_1.z.string().cuid(),
    uploadedById: zod_1.z.string().cuid(),
    title: zod_1.z.string().min(1).max(255),
    originalName: zod_1.z.string().min(1).max(255),
    mimeType: zod_1.z.string(),
    category: zod_1.z.nativeEnum(DocumentCategory).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    content: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    confidenceScore: zod_1.z.number().min(0).max(1).optional(),
    processingTime: zod_1.z.number().int().positive().optional(),
    hash: zod_1.z.string(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.CreateDocumentSchema = zod_1.z.object({
    workspaceId: zod_1.z.string().cuid(),
    title: zod_1.z.string().min(1).max(255).optional(),
    category: zod_1.z.nativeEnum(DocumentCategory).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional()
});
exports.UpdateDocumentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(255).optional(),
    category: zod_1.z.nativeEnum(DocumentCategory).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional()
});
// Chat Schemas
exports.ChatSessionSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    documentId: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
    title: zod_1.z.string().min(1).max(255),
    context: zod_1.z.record(zod_1.z.any()).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.CreateChatSessionSchema = zod_1.z.object({
    documentId: zod_1.z.string().cuid(),
    title: zod_1.z.string().min(1).max(255).optional()
});
exports.ChatMessageSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    sessionId: zod_1.z.string().cuid(),
    type: zod_1.z.nativeEnum(ChatMessageType),
    content: zod_1.z.string().min(1),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    citations: zod_1.z.array(zod_1.z.object({
        pageNumber: zod_1.z.number().int().positive().optional(),
        text: zod_1.z.string(),
        confidence: zod_1.z.number().min(0).max(1).optional()
    })).optional(),
    confidenceScore: zod_1.z.number().min(0).max(1).optional(),
    createdAt: zod_1.z.date()
});
exports.CreateChatMessageSchema = zod_1.z.object({
    sessionId: zod_1.z.string().cuid(),
    content: zod_1.z.string().min(1)
});
// Comparison Schema
exports.DocumentComparisonSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    doc1Id: zod_1.z.string().cuid(),
    doc2Id: zod_1.z.string().cuid(),
    results: zod_1.z.object({
        similarityScore: zod_1.z.number().min(0).max(1),
        differences: zod_1.z.array(zod_1.z.object({
            type: zod_1.z.enum(['added', 'removed', 'modified']),
            text: zod_1.z.string(),
            position: zod_1.z.object({
                start: zod_1.z.number().int().nonnegative(),
                end: zod_1.z.number().int().nonnegative()
            }),
            similarity: zod_1.z.number().min(0).max(1).optional()
        })),
        commonClauses: zod_1.z.array(zod_1.z.object({
            text: zod_1.z.string(),
            similarity: zod_1.z.number().min(0).max(1),
            doc1Position: zod_1.z.object({
                start: zod_1.z.number().int().nonnegative(),
                end: zod_1.z.number().int().nonnegative()
            }),
            doc2Position: zod_1.z.object({
                start: zod_1.z.number().int().nonnegative(),
                end: zod_1.z.number().int().nonnegative()
            })
        }))
    }),
    similarityScore: zod_1.z.number().min(0).max(1),
    performedById: zod_1.z.string().cuid(),
    createdAt: zod_1.z.date()
});
exports.CreateComparisonSchema = zod_1.z.object({
    doc1Id: zod_1.z.string().cuid(),
    doc2Id: zod_1.z.string().cuid()
});
// Analytics Schemas
exports.AnalyticsMetricsSchema = zod_1.z.object({
    totalDocuments: zod_1.z.number().int().nonnegative(),
    totalUsers: zod_1.z.number().int().nonnegative(),
    totalWorkspaces: zod_1.z.number().int().nonnegative(),
    documentsThisMonth: zod_1.z.number().int().nonnegative(),
    activeUsersThisMonth: zod_1.z.number().int().nonnegative(),
    averageProcessingTime: zod_1.z.number().nonnegative(),
    storageUsed: zod_1.z.number().nonnegative(),
    apiCallsThisMonth: zod_1.z.number().int().nonnegative()
});
//# sourceMappingURL=index.js.map