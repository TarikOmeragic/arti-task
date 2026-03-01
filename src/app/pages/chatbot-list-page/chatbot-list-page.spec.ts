import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotListPage } from './chatbot-list-page';

describe('ChatbotListPage', () => {
  let component: ChatbotListPage;
  let fixture: ComponentFixture<ChatbotListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
