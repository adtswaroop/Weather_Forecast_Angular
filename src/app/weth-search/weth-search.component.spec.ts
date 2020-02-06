import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WethSearchComponent } from './weth-search.component';

describe('WethSearchComponent', () => {
  let component: WethSearchComponent;
  let fixture: ComponentFixture<WethSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WethSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WethSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
