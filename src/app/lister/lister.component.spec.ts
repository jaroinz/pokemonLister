import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerComponent } from './lister.component';
import {HttpClientModule} from "@angular/common/http";

describe('ListerComponent', () => {
  let component: ListerComponent;
  let fixture: ComponentFixture<ListerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ ListerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render initial current counter', () => {
    const fixture = TestBed.createComponent(ListerComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div .currentCounter')?.textContent).toContain('0 of: 0 records');
  });

  it('should render 20 of 40', () => {
    const fixture = TestBed.createComponent(ListerComponent);
    component = fixture.componentInstance;
    component.currentCount = 20;
    component.count = 40;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div .currentCounter')?.textContent).toContain('20 of: 40 records');
  });

});
