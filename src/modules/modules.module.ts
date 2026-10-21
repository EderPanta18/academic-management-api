// modules/modules.module.ts

import { Module } from '@nestjs/common';
import { AcademicPeriodsModule } from './academic-periods';
import { AcademicProgramsModule } from './academic-programs';
import { CourseOfferingsModule } from './course-offerings';
import { CoursesModule } from './courses';
import { EnrollmentsModule } from './enrollments';
import { IdentityModule } from './identity';
import { ProfessorsModule } from './professors';
import { StudentsModule } from './students';

@Module({
  imports: [
    IdentityModule,
    AcademicProgramsModule,
    AcademicPeriodsModule,
    CoursesModule,
    ProfessorsModule,
    StudentsModule,
    CourseOfferingsModule,
    EnrollmentsModule,
  ],
})
export class ModulesModule {}
