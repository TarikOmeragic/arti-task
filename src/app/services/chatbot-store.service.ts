import { computed, Injectable, signal } from '@angular/core';

import { generateUUID } from '../helpers/uuid-generator';
import { ChatbotConfig } from '../interfaces/chatbot-config';
import { StorageService } from './storage.service';

const CHATBOTS_KEY = 'chatbots';
const SELECTED_ID_KEY = 'selected-id';

@Injectable({
  providedIn: 'root',
})
export class ChatbotStoreService {

  private _chatbots = signal<ChatbotConfig[]>([]);
  private _selectedChatbotId = signal<string | null>(null);

  readonly chatbots = computed(() => this._chatbots());
  readonly selectedChatbotId = computed(() => this._selectedChatbotId());
  readonly selectedChatbot = computed(() => this._chatbots().find(chatbot => chatbot.id === this._selectedChatbotId()) ?? null);

  constructor(private storageService: StorageService) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = this.storageService.getItem<ChatbotConfig[]>(CHATBOTS_KEY);
    const storedSelected = this.storageService.getItem<string | null>(SELECTED_ID_KEY);

    if (stored) {
      this._chatbots.set(stored);
    }
    if (storedSelected) {
      this.selectChatBot(storedSelected);
    }
  }

  private persistToStorage(): void {
    this.storageService.setItem(CHATBOTS_KEY, this._chatbots());
    this.storageService.setItem(SELECTED_ID_KEY, this._selectedChatbotId());
  }

  selectConfig(id: string): void {
    this.selectChatBot(id);
    this.persistToStorage();
  }

  createConfig(config: Omit<ChatbotConfig, 'id'>): ChatbotConfig {
    const newConfig = {
      ...config,
      id: generateUUID(),
    };

    this._chatbots.update(chatbots => 
      [...chatbots, newConfig]
    );

    this.selectChatBot(newConfig.id);
    this.persistToStorage();

    return newConfig;
  }

  updateConfig(id: string, config: Partial<ChatbotConfig>): void {
    this._chatbots.update(chatbots => 
      chatbots.map(chatbot => chatbot.id === id ? { ...chatbot, ...config } : chatbot)
    );
    this.selectChatBot(id);

    this.persistToStorage();
  }

  deleteConfig(id: string): void {
    this._chatbots.update(chatbots => 
      chatbots.filter(chatbot => chatbot.id !== id)
    );

    if (this._selectedChatbotId() === id) {
      this.selectChatBot();
    }

    this.persistToStorage();
  }

  selectChatBot(id: string | null = null): void {
    this._selectedChatbotId.set(id);
  }

  // addFilesToConfig(configId: string, files: KnowledgeBaseFile[]): void {
  //   this._chatbots.update(chatbots => 
  //     chatbots.map(chatbot => 
  //       chatbot.id === configId
  //       ? {
  //         ...chatbot,
  //         knowledgeBaseFiles: [...chatbot.knowledgeBaseFiles, ...files]
  //       }
  //       : chatbot
  //     )
  //   )
  //   this.selectChatBot(configId);
  //   this.persistToStorage();
  // }

  // removeFileFromConfig(configId: string, fileId: string): void {
  //   this._chatbots.update(chatbots =>
  //     chatbots.map(chatbot =>
  //       chatbot.id === configId
  //       ? {
  //         ...chatbot,
  //         knowledgeBaseFiles: chatbot.knowledgeBaseFiles.filter(f => f.id !== fileId)
  //       }
  //       : chatbot
  //     )
  //   )
  //   this.selectChatBot(configId);
  //   this.persistToStorage();
  // }
}
