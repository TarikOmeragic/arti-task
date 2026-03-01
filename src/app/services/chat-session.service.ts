import { computed, Injectable, signal } from '@angular/core';

import { generateUUID } from '../helpers/uuid-generator';
import { ChatMessage } from '../interfaces/chat-message';
import { ChatbotConfig } from '../interfaces/chatbot-config';

@Injectable({
  providedIn: 'root',
})
export class ChatSessionService {
  private readonly _messages = signal<ChatMessage[]>([]);
  private readonly _isBotTyping = signal<boolean>(false);

  readonly messages = computed(() => this._messages());
  readonly isBotTyping = computed(() => this._isBotTyping());

  resetSession(): void {
    this._messages.set([]);
    this._isBotTyping.set(false);
  }

  sendUserMessage(message: string, config: ChatbotConfig): void {
    if (!message.trim()) {
      return;
    }

    const timestamp = new Date().toISOString();
    const userMsg: ChatMessage = {
      id: generateUUID(),
      role: 'user',
      text: message.trim(),
      timestamp,
    };

    this._messages.update(list => [...list, userMsg]);
    this._isBotTyping.set(true);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: generateUUID(),
        role: 'bot',
        text: this.buildFakeReply(userMsg.text, config),
        timestamp: new Date().toISOString(),
      };

      this._messages.update(list => [...list, reply]);
      this._isBotTyping.set(false);
    }, 1500);
  }

  private buildFakeReply(userText: string, config: ChatbotConfig | null): string {
    if (!config) {
      return `I'm a demo bot without a config yet, but I heard: "${userText}".`;
    }

    return `${config.name}: You said: "${userText}". This is just a simulated reply.`;
  }  
}
