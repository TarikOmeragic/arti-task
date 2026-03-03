import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, effect, ElementRef, OnInit, Signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ChatMessage } from '../../interfaces/chat-message';
import { ChatbotConfig } from '../../interfaces/chatbot-config';
import { ChatSessionService } from '../../services/chat-session.service';
import { ChatbotStoreService } from '../../services/chatbot-store.service';

@Component({
  selector: 'app-chat-simulation',
  imports: [CommonModule, FormsModule, MatIconModule, MatInputModule, MatButtonModule],
  templateUrl: './chat-simulation.html',
  styleUrl: './chat-simulation.scss',
  standalone: true
})
export class ChatSimulation implements OnInit, AfterViewChecked {

  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;

  messages!: Signal<ChatMessage[]>;
  isBotTyping!: Signal<boolean>;
  selectedChatbot!: Signal<ChatbotConfig | null>;
  inputText = '';

  private prevMessagesLength = 0;
  private prevBotTyping = false;

  constructor(
    private chatSessionService: ChatSessionService,
    private chatbotStoreService: ChatbotStoreService
  ) {
    effect(() => {
      this.messages().length;
      this.isBotTyping();
      this.scheduleScrollToBottom();
    });
  }

  ngOnInit(): void {
    this.messages = this.chatSessionService.messages;
    this.isBotTyping = this.chatSessionService.isBotTyping;
    this.selectedChatbot = this.chatbotStoreService.selectedChatbot;
  }

  ngAfterViewChecked(): void {
    const len = this.messages().length;
    const typing = this.isBotTyping();
    if (len !== this.prevMessagesLength || typing !== this.prevBotTyping) {
      this.prevMessagesLength = len;
      this.prevBotTyping = typing;
      this.scheduleScrollToBottom();
    }
  }

  private scheduleScrollToBottom(): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.scrollToBottom());
    });
  }

  private scrollToBottom(): void {
    const el = this.messagesContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  send(): void {
    const bot = this.selectedChatbot();
    if (!bot) {
      return;
    }

    this.chatSessionService.sendUserMessage(this.inputText, bot);
    this.inputText = '';
  }
}
