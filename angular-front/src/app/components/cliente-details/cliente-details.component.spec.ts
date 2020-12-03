import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteDetailsComponent } from './cliente-details.component';

describe('ClienteDetailsComponent', () => {
  let component: ClienteDetailsComponent;
  let fixture: ComponentFixture<ClienteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
