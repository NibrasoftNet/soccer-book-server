import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { ArenaCategoryDto } from '@/domains/area-category/arena-category.dto';
import { FileDto } from '@/domains/files/file.dto';
import { ReservationDto } from '@/domains/reservation/reservation.dto';
import { ComplexDto } from '@/domains/complex/complex.dto';
import { ArenaTestimonialDto } from '@/domains/arena-testimonials/arena-testimonial.dto';

export class ArenaDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => ComplexDto)
  complex: ComplexDto;

  @AutoMap(() => ArenaCategoryDto)
  category: ArenaCategoryDto;

  @AutoMap(() => [FileDto])
  image: FileDto[];

  @AutoMap()
  active: boolean;

  @AutoMap()
  covered: boolean;

  @AutoMap()
  length: number;

  @AutoMap()
  width: number;

  @AutoMap(() => [ReservationDto])
  reservations: ReservationDto[];

  @AutoMap()
  unitQuantity: number;

  @AutoMap()
  unitPrice: number;

  @AutoMap(() => [ArenaTestimonialDto])
  testimonials: ArenaTestimonialDto[];
}
