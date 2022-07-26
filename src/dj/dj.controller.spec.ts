import { Test, TestingModule } from '@nestjs/testing';
import { DjController } from './dj.controller';

describe('DjController', () => {
  let controller: DjController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DjController],
    }).compile();

    controller = module.get<DjController>(DjController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
