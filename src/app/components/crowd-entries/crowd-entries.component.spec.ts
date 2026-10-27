import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrowdEntriesComponent } from './crowd-entries.component';

describe('CrowdEntriesComponent', () => {
  let component: CrowdEntriesComponent;
  let fixture: ComponentFixture<CrowdEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrowdEntriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrowdEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
