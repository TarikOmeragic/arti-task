import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';

import { ChatSimulation } from '../../components/chat-simulation/chat-simulation';
import { ChatbotConfigDialog } from '../../components/chatbot-config-dialog/chatbot-config-dialog';
import { ChatbotConfig } from '../../interfaces/chatbot-config';
import { ChatSessionService } from '../../services/chat-session.service';
import { ChatbotStoreService } from '../../services/chatbot-store.service';

@Component({
  selector: 'app-chatbot-chat-page',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatCardModule, MatListModule, ChatSimulation],
  templateUrl: './chatbot-chat-page.html',
  styleUrl: './chatbot-chat-page.scss',
  standalone: true
})
export class ChatbotChatPage implements OnInit {

  readonly selectedChatbot: Signal<ChatbotConfig | null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatbotStoreService: ChatbotStoreService,
    private dialog: MatDialog,
    private chatSessionService: ChatSessionService
  ) {
    this.selectedChatbot = this.chatbotStoreService.selectedChatbot;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/chatbots']);
      return;
    }

    this.chatbotStoreService.selectConfig(id);
    this.chatSessionService.resetSession();
  }

  back(): void {
    this.router.navigate(['/chatbots']);
  }

  edit(): void {
    const bot = this.selectedChatbot();
    if (!bot) return;
    this.dialog.open(ChatbotConfigDialog, {
      width: '800px',
      data: { chatbotId: bot.id }
    });
  }

}
