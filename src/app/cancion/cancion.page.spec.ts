import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CancionPage } from './cancion.page';

describe('CancionPage', () => {
  let component: CancionPage;
  let fixture: ComponentFixture<CancionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CancionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
