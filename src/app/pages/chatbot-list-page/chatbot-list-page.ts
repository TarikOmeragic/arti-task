import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ChatbotConfigDialog } from '../../components/chatbot-config-dialog/chatbot-config-dialog';
import { ChatbotList } from '../../components/chatbot-list/chatbot-list';

@Component({
  selector: 'app-chatbot-list-page',
  imports: [MatButtonModule, MatIconModule, ChatbotList],
  templateUrl: './chatbot-list-page.html',
  styleUrl: './chatbot-list-page.scss',
  standalone: true
})
export class ChatbotListPage {

  constructor(private dialog: MatDialog) {}

  openCreateDialog() {
    this.dialog.open(ChatbotConfigDialog, {
      width: '800px'
    })
  }
}
