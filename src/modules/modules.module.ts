//modules/modules.module.ts

import { Module } from '@nestjs/common';
import { PersonsModule } from './persons';
import { DepartmentsModule } from './departments';
import { CareersModule } from './careers';
import { AcademicPeriodsModule } from './academic-periods';
import { CourseCategoriesModule } from './course-categories';
import { CoursesModule } from './courses';
import { ProfessorsModule } from './professors';
import { StudentsModule } from './students';
import { CourseOfferingsModule } from './course-offerings';
import { EnrollmentsModule } from './enrollments';

@Module({
  imports: [
    PersonsModule,
    DepartmentsModule,
    CareersModule,
    AcademicPeriodsModule,
    CourseCategoriesModule,
    CoursesModule,
    ProfessorsModule,
    StudentsModule,
    CourseOfferingsModule,
    EnrollmentsModule,
  ],
})
export class ModulesModule {}
