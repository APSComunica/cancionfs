import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConstruirPage } from './construir.page';

describe('ConstruirPage', () => {
  let component: ConstruirPage;
  let fixture: ComponentFixture<ConstruirPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstruirPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConstruirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
