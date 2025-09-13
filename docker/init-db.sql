-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_workspace_id ON documents(workspace_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_sessions_document_id ON chat_sessions(document_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_activities_workspace_id ON user_activities(workspace_id);