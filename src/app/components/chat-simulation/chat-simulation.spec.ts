import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSimulation } from './chat-simulation';

describe('ChatSimulation', () => {
  let component: ChatSimulation;
  let fixture: ComponentFixture<ChatSimulation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSimulation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatSimulation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
