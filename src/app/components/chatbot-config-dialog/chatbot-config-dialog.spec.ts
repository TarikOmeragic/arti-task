import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotConfigDialog } from './chatbot-config-dialog';

describe('ChatbotConfigDialog', () => {
  let component: ChatbotConfigDialog;
  let fixture: ComponentFixture<ChatbotConfigDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotConfigDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotConfigDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
