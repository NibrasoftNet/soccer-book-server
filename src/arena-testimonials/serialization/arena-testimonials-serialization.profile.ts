import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { ArenaTestimonial } from '../entities/arena-testimonial.entity';
import { ArenaTestimonialDto } from '@/domains/arena-testimonials/arena-testimonial.dto';

export class ArenaTestimonialsSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, ArenaTestimonial, ArenaTestimonialDto);
    };
  }
}
