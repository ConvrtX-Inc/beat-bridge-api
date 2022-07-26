import { Test, TestingModule } from '@nestjs/testing';
import { DjService } from './dj.service';

describe('DjService', () => {
  let service: DjService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DjService],
    }).compile();

    service = module.get<DjService>(DjService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
