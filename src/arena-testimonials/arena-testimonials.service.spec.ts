import { Test, TestingModule } from '@nestjs/testing';
import { ArenaTestimonialsService } from './arena-testimonials.service';

describe('ArenaTestimonialsService', () => {
  let service: ArenaTestimonialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArenaTestimonialsService],
    }).compile();

    service = module.get<ArenaTestimonialsService>(ArenaTestimonialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
