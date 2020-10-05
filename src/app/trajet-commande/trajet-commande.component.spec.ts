import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetCommandeComponent } from './trajet-commande.component';

describe('TrajetCommandeComponent', () => {
  let component: TrajetCommandeComponent;
  let fixture: ComponentFixture<TrajetCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
