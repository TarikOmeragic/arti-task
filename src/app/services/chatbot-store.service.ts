import { computed, Injectable, signal } from '@angular/core';

import { CHATBOTS_KEY, SELECTED_ID_KEY } from '../constants';
import { generateUUID } from '../helpers/uuid-generator';
import { ChatbotConfig } from '../interfaces/chatbot-config';
import { StorageService } from './storage.service';

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
    if (storedSelected && stored?.some(bot => bot.id === storedSelected)) {
      this.selectChatbotConfig(storedSelected);
    } else {
      this.selectChatbotConfig(null);
    }
  }

  private persistToStorage(): void {
    this.storageService.setItem(CHATBOTS_KEY, this._chatbots());
    this.storageService.setItem(SELECTED_ID_KEY, this._selectedChatbotId());
  }

  selectConfig(id: string): void {
    this.selectChatbotConfig(id);
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

    this.selectChatbotConfig(newConfig.id);
    this.persistToStorage();

    return newConfig;
  }

  updateConfig(id: string, config: Partial<ChatbotConfig>): void {
    this._chatbots.update(chatbots => 
      chatbots.map(chatbot => chatbot.id === id ? { ...chatbot, ...config } : chatbot)
    );
    this.selectChatbotConfig(id);

    this.persistToStorage();
  }

  deleteConfig(id: string): void {
    this._chatbots.update(chatbots => 
      chatbots.filter(chatbot => chatbot.id !== id)
    );

    if (this._selectedChatbotId() === id) {
      this.selectChatbotConfig(null);
    }

    this.persistToStorage();
  }

  private selectChatbotConfig(id: string | null): void {
    this._selectedChatbotId.set(id);
  }
}
