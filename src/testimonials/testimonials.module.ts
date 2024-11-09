import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsSerializationProfile } from './serialization/testimonials-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonial]), UsersModule],
  controllers: [TestimonialsController],
  providers: [TestimonialsService, TestimonialsSerializationProfile],
})
export class TestimonialsModule {}
