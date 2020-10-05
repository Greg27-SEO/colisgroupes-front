import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTrajetComponent } from './admin-trajet.component';

describe('AdminTrajetComponent', () => {
  let component: AdminTrajetComponent;
  let fixture: ComponentFixture<AdminTrajetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTrajetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
