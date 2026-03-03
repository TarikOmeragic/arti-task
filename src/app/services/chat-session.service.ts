import { computed, Injectable, signal } from '@angular/core';

import { BOT_REPLY_DELAY } from '../constants';
import { generateUUID } from '../helpers/uuid-generator';
import { ChatMessage } from '../interfaces/chat-message';
import { ChatbotConfig } from '../interfaces/chatbot-config';

@Injectable({
  providedIn: 'root',
})
export class ChatSessionService {
  private _messages = signal<ChatMessage[]>([]);
  private _isBotTyping = signal<boolean>(false);
  private botReplyTimeout: number | null = null;

  readonly messages = computed(() => this._messages());
  readonly isBotTyping = computed(() => this._isBotTyping());

  resetSession(): void {
    this._messages.set([]);
    this._isBotTyping.set(false);
    this.clearBotReplyTimeout();
  }

  sendUserMessage(message: string, config: ChatbotConfig): void {
    if (!message.trim()) {
      return;
    }

    this.clearBotReplyTimeout();

    const timestamp = new Date().toISOString();
    const userMsg: ChatMessage = {
      id: generateUUID(),
      role: 'user',
      text: message.trim(),
      timestamp,
    };

    this._messages.update(list => [...list, userMsg]);
    this._isBotTyping.set(true);

    this.botReplyTimeout = setTimeout(() => {
      const reply: ChatMessage = {
        id: generateUUID(),
        role: 'bot',
        text: this.buildFakeReply(userMsg.text, config),
        timestamp: new Date().toISOString(),
      };

      this._messages.update(list => [...list, reply]);
      this._isBotTyping.set(false);
      this.botReplyTimeout = null;
    }, BOT_REPLY_DELAY);
  }

  private buildFakeReply(userText: string, config: ChatbotConfig): string {
    return `${config.name}: You said: "${userText}". This is a simulated reply.`;
  }

  private clearBotReplyTimeout(): void {
    if (this.botReplyTimeout !== null) {
      clearTimeout(this.botReplyTimeout);
      this.botReplyTimeout = null;
    }
  }
}
