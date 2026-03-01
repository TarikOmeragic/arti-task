import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotChatPage } from './chatbot-chat-page';

describe('ChatbotChatPage', () => {
  let component: ChatbotChatPage;
  let fixture: ComponentFixture<ChatbotChatPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotChatPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
