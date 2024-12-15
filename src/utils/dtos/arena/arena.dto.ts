import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { ArenaCategoryDto } from '@/domains/area-category/arena-category.dto';
import { FileDto } from '@/domains/files/file.dto';
import { ReservationDto } from '@/domains/reservation/reservation.dto';
import { ComplexDto } from '@/domains/complex/complex.dto';
import { ArenaTestimonialDto } from '@/domains/arena-testimonials/arena-testimonial.dto';
import { Expose } from 'class-transformer';

export class ArenaDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap(() => ComplexDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  complex: ComplexDto;

  @AutoMap(() => ArenaCategoryDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  category: ArenaCategoryDto;

  @AutoMap(() => [FileDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  image: FileDto[];

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  active: boolean;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  covered: boolean;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  length: number;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  width: number;

  @AutoMap(() => [ReservationDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  reservations: ReservationDto[];

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  unitQuantity: number;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  unitPrice: number;

  @AutoMap(() => [ArenaTestimonialDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  testimonials: ArenaTestimonialDto[];
}
