/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConsultaCepService } from './consulta-cep.service';

describe('Service: ConsultaCep', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsultaCepService]
    });
  });

  it('should ...', inject([ConsultaCepService], (service: ConsultaCepService) => {
    expect(service).toBeTruthy();
  }));
});
