import { Module } from '@nestjs/common';
import { ArenaTestimonialsService } from './arena-testimonials.service';
import { ArenaTestimonialsController } from './arena-testimonials.controller';
import { ArenaTestimonialsSerializationProfile } from './serialization/arena-testimonials-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArenaTestimonial } from './entities/arena-testimonial.entity';
import { UsersModule } from '../users/users.module';
import { ArenaModule } from '../arena/arena.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArenaTestimonial]),
    UsersModule,
    ArenaModule,
  ],
  controllers: [ArenaTestimonialsController],
  providers: [ArenaTestimonialsService, ArenaTestimonialsSerializationProfile],
})
export class ArenaTestimonialsModule {}
