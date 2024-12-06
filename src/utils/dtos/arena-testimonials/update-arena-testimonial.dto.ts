import { PartialType } from '@nestjs/swagger';
import { CreateArenaTestimonialDto } from '@/domains/arena-testimonials/create-arena-testimonial.dto';

export class UpdateArenaTestimonialDto extends PartialType(
  CreateArenaTestimonialDto,
) {}
