import { KnowledgeBaseFile } from "./knowledge-base-file";

export interface ChatbotConfig {
    id: string;
    name: string;
    personality: number; // 0.0 - 1.0
    description: string;
    knowledgeBaseFiles: KnowledgeBaseFile[];
}
