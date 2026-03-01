import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';

import { generateUUID } from '../../helpers/uuid-generator';
import { KnowledgeBaseFile } from '../../interfaces/knowledge-base-file';
import { ChatbotStoreService } from '../../services/chatbot-store.service';

export interface ChatbotConfigDialogData {
  chatbotId?: string;
}

@Component({
  selector: 'app-chatbot-config-dialog',
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSliderModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './chatbot-config-dialog.html',
  styleUrl: './chatbot-config-dialog.scss',
  standalone: true
})
export class ChatbotConfigDialog implements OnInit {

  createAction: boolean = true;
  files: KnowledgeBaseFile[] = [];
  editingId: string | undefined = undefined;
  configForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private chatbotStoreService: ChatbotStoreService,
    private dialogRef: MatDialogRef<ChatbotConfigDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ChatbotConfigDialogData,
  ) {}

  ngOnInit(): void {
    this.configForm = this.formBuilder.group({
      name: ['', Validators.required],
      personality: [0.5, [Validators.min(0), Validators.max(1)]],
      description: ['', Validators.required]
    });

    this.createAction = !this.data.chatbotId;

    if (!this.createAction) {
      this.editingId = this.data.chatbotId;
      const bot = this.chatbotStoreService.chatbots().find(chatbot => chatbot.id === this.editingId);
      if (bot) {
        this.configForm.patchValue({
          name: bot.name,
          personality: bot.personality,
          description: bot.description,
        });
        this.files = [...bot.knowledgeBaseFiles];
      }
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const selected: KnowledgeBaseFile[] = Array.from(input.files)
      .filter(file => !this.files.some(existing => existing.name === file.name))
      .map(file => ({
        id: generateUUID(),
        name: file.name,
        size: file.size,
        addedAt: new Date().toISOString(),
      }));

    this.files = [...this.files, ...selected];
    input.value = '';
  }

  removeFile(id: string): void {
    this.files = this.files.filter(f => f.id !== id);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }

    const { name, personality, description } = this.configForm.getRawValue();

    if (this.createAction || !this.editingId) {
      const created = this.chatbotStoreService.createConfig({
        name,
        personality,
        description,
        knowledgeBaseFiles: this.files,
      });
      this.dialogRef.close(created);
      return;
    }

    // edit mode
    this.chatbotStoreService.updateConfig(this.editingId, {
      name,
      personality,
      description,
      knowledgeBaseFiles: this.files,
    });
    this.dialogRef.close(this.editingId);
  }

}
