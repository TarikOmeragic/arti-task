import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { ChatbotConfig } from '../../interfaces/chatbot-config';
import { ChatbotStoreService } from '../../services/chatbot-store.service';
import { ChatbotConfigDialog } from '../chatbot-config-dialog/chatbot-config-dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-chatbot-list',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './chatbot-list.html',
  styleUrl: './chatbot-list.scss',
  standalone: true
})
export class ChatbotList implements OnInit {
  chatbots!: Signal<ChatbotConfig[]>;
  displayedColumns = ['name', 'personality', 'files', 'actions'];

  constructor(
    private chatbotStoreService: ChatbotStoreService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chatbots = this.chatbotStoreService.chatbots;
  }

  openEditDialog(id: string): void {
    this.dialog.open(ChatbotConfigDialog, {
      width: '800px',
      data: { chatbotId: id },
    });
  }

  openChat(id: string): void {
    this.router.navigate(['/chatbots', id]);
  }

  delete(id: string, event: MouseEvent): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.chatbotStoreService.deleteConfig(id);
      }
    });
  }
}
